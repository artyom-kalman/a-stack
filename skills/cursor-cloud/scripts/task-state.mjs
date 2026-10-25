import { createHash, randomUUID } from 'node:crypto';
import { mkdir, open, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const closedPhases = new Set(['ready', 'merged', 'blocked']);
export const digest = (text) => createHash('sha256').update(text).digest('hex');

export function taskDirectory(root, issue) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(issue ?? '')) {
    throw new Error('Task ID must contain only letters, digits, underscores or hyphens');
  }
  return join(root, issue);
}

export async function readState(dir) {
  try {
    return JSON.parse(await readFile(join(dir, 'state.json'), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

export async function saveState(dir, state) {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const temporary = join(dir, `state-${randomUUID()}.tmp`);
  await writeFile(temporary, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
  await rename(temporary, join(dir, 'state.json'));
}

export async function withTaskLock(dir, action) {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const lockPath = join(dir, 'operation.lock');
  const lock = await open(lockPath, 'wx', 0o600).catch((error) => {
    if (error.code === 'EEXIST') {
      throw new Error(`Task operation already locked: ${lockPath}. Check its PID before removing a stale lock.`);
    }
    throw error;
  });
  try {
    await lock.writeFile(String(process.pid));
    return await action();
  } finally {
    await lock.close();
    await rm(lockPath);
  }
}

export function validateConfig(config, brief) {
  const allowed = new Set(['issue', 'repository', 'ref', 'model', 'briefPath', 'budgetUsd', 'maxFollowups']);
  if (Object.keys(config).some((key) => !allowed.has(key))) throw new Error('Unexpected config field; credentials belong in SDK auth, not task config');
  for (const key of ['issue', 'repository', 'ref', 'model', 'briefPath']) {
    if (typeof config[key] !== 'string' || !config[key].trim()) {
      throw new Error(`Missing config ${key}`);
    }
  }
  if (!/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(config.repository)) {
    throw new Error('Repository must be an HTTPS GitHub repository URL');
  }
  if (!brief.trim()) throw new Error('Handoff brief is empty');
  config.budgetUsd ??= 5;
  config.maxFollowups ??= 2;
  if (!Number.isFinite(config.budgetUsd) || config.budgetUsd <= 0) throw new Error('Invalid budgetUsd');
  if (!Number.isInteger(config.maxFollowups) || config.maxFollowups < 0) throw new Error('Invalid maxFollowups');
  return config;
}

export async function startTask(dir, config, brief, backend) {
  if (await readState(dir)) throw new Error('Task already recorded. Inspect its state; do not recreate it.');
  const state = {
    ...config, brief, createdAt: new Date().toISOString(), phase: 'creating',
    createRequestId: randomUUID(), submissions: [], seenMessages: [],
  };
  await saveState(dir, state);
  const agent = await backend.create(state);
  state.agentId = agent.agentId;
  state.cloudUrl = `https://cursor.com/agents/${agent.agentId}`;
  await saveState(dir, state);
  return submit(dir, state, brief, agent);
}

async function submit(dir, state, prompt, agent) {
  const entry = { digest: digest(prompt), prompt, attemptedAt: new Date().toISOString(), idempotencyKey: randomUUID() };
  state.submissions.push(entry);
  state.phase = 'submitting';
  delete state.result;
  delete state.git;
  delete state.error;
  await saveState(dir, state);
  try {
    const run = await agent.send(prompt, { idempotencyKey: entry.idempotencyKey });
    entry.runId = run.id;
    state.runId = run.id;
    state.phase = 'running';
    await saveState(dir, state);
    return state;
  } finally {
    await agent[Symbol.asyncDispose]();
  }
}

export async function followupTask(dir, state, prompt, backend) {
  if (closedPhases.has(state.phase)) throw new Error(`Task is ${state.phase}; no paid follow-up permitted`);
  if (!prompt.trim()) throw new Error('Follow-up is empty');
  if (state.submissions.some((s) => !s.runId)) throw new Error('Uncertain send: reconcile before another submission');
  if (state.submissions.some((s) => s.digest === digest(prompt))) throw new Error('Follow-up already attempted');
  if (state.submissions.length - 1 >= state.maxFollowups) throw new Error('Revision limit reached; bring work into a local worktree');
  const run = await backend.getRun(state);
  if (run.status === 'running') throw new Error('Current run is active; collect findings and wait for delivery');
  const usage = await backend.getUsage(state);
  state.usage = usage;
  await saveState(dir, state);
  if (!Number.isFinite(usage.cost?.chargedCents)) throw new Error('Charged usage unavailable; reconcile spend before continuing');
  const billedRun = usage.runs?.find((item) => item.runId === state.runId);
  if (!Number.isFinite(billedRun?.cost?.chargedCents)) {
    throw new Error('Current run billing has not arrived; reconcile spend before continuing');
  }
  if (usage.cost.chargedCents >= state.budgetUsd * 100) throw new Error('Continuation budget reached; bring work into a local worktree');
  const agent = await backend.resume(state);
  return submit(dir, state, prompt, agent);
}

export function requireKnownSubmission(state) {
  if (!state.runId || state.submissions.some((item) => !item.runId)) {
    throw new Error('Uncertain send: reconcile agent/run metadata before status or finishing');
  }
}

export function finishTask(state, head) {
  requireKnownSubmission(state);
  if (state.phase !== 'delivery') throw new Error('Only reviewed delivered work can be finished');
  if (!/^[a-f0-9]{7,40}$/.test(head ?? '')) throw new Error('Reviewed head SHA required');
  return { ...state, phase: 'ready', reviewedHead: head, finishedAt: new Date().toISOString() };
}
