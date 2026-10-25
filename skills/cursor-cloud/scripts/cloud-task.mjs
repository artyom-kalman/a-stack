#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { Agent, Cursor, FileCredentialStore } from '@cursor/sdk';
import {
  closedPhases, digest, finishTask, followupTask, readState, requireKnownSubmission, saveState, startTask,
  taskDirectory, validateConfig, withTaskLock,
} from './task-state.mjs';

const root = process.env.CURSOR_CLOUD_STATE_DIR ?? join(homedir(), '.local/state/cursor-cloud');
const [command, target, extra] = process.argv.slice(2);
let secret;
const print = (value) => console.log(redact(JSON.stringify(value)));
const redact = (value) => secret
  ? value.replaceAll(secret, '[REDACTED]').replaceAll(Buffer.from(`${secret}:`).toString('base64'), '[REDACTED]')
  : value;

async function authenticate() {
  const credentials = await new FileCredentialStore().load();
  secret = process.env.CURSOR_API_KEY ?? credentials?.apiKey;
  if (!secret || (!process.env.CURSOR_API_KEY && credentials?.apiKeyExpiresAtMs <= Date.now())) {
    throw new Error('Cursor SDK login missing/expired. Complete official Cursor.auth.login(); never put keys in chat.');
  }
  return { apiKey: secret };
}

function backend(auth) {
  return {
    create: (state) => Agent.create({
      ...auth, model: { id: state.model },
      cloud: { repos: [{ url: state.repository, startingRef: state.ref }], autoCreatePR: false,
        metadata: { issue: state.issue, client_request_id: state.createRequestId } },
    }),
    resume: (state) => Agent.resume(state.agentId, auth),
    getRun: (state) => Agent.getRun(state.runId, { ...auth, runtime: 'cloud', agentId: state.agentId }),
    getUsage: (state) => Agent.getUsage(state.agentId, auth),
    // SDK conversation() waits for stream completion. Use the official legacy
    // read endpoint for a bounded live snapshot; metadata remains SDK-backed.
    getConversation: async (state) => {
      const response = await fetch(`https://api.cursor.com/v0/agents/${encodeURIComponent(state.agentId)}/conversation`, {
        headers: { Authorization: `Basic ${Buffer.from(`${auth.apiKey}:`).toString('base64')}` },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`Conversation HTTP ${response.status}`);
      return response.json();
    },
  };
}

async function reportStatus(dir, state, api) {
  if (closedPhases.has(state.phase)) {
    print({ event: 'closed', issue: state.issue, phase: state.phase, head: state.reviewedHead });
    return;
  }
  if (!state.agentId) throw new Error('Incomplete launch: reconcile stored agent before retrying');
  requireKnownSubmission(state);
  const run = await api.getRun(state);
  if (run.git) state.git = run.git;
  let unseen = [];
  try {
    const conversation = await api.getConversation(state);
    await writeFile(join(dir, `conversation-${run.id}.json`), redact(JSON.stringify(conversation, null, 2)), { mode: 0o600 });
    const messages = conversation.messages.filter((m) => m.type === 'assistant_message');
    unseen = messages.filter((m) => !state.seenMessages.includes(m.id)).map((m) => m.text);
    state.seenMessages = [...new Set([...state.seenMessages, ...messages.map((m) => m.id)])];
    delete state.conversationError;
  } catch (error) { state.conversationError = redact(error.message); }
  state.lastCheckedAt = new Date().toISOString();
  state.runStatus = run.status;
  if (run.status !== 'running') {
    const result = await run.wait();
    state.result = result.result;
    state.git = result.git;
    state.error = result.error;
    state.phase = result.status === 'finished' ? 'delivery' : 'failed';
    try { state.usage = await api.getUsage(state); }
    catch (error) { state.usageError = redact(error.message); }
  }
  await saveState(dir, state);
  print({ event: 'status', issue: state.issue, phase: state.phase, status: state.runStatus,
    cloudUrl: state.cloudUrl, git: state.git, newMessages: unseen,
    cost: state.usage?.cost, error: state.error, conversationError: state.conversationError });
}

async function main() {
  if (command === 'doctor') {
    const auth = await authenticate();
    const [models, repos] = await Promise.all([Cursor.models.list(auth), Cursor.repositories.list(auth)]);
    print({ authenticated: true, models: models.map((m) => m.id), repositories: repos });
    return;
  }
  if (!['start', 'status', 'followup', 'evidence', 'finish'].includes(command)) {
    throw new Error('Use doctor | start config.json | status ID | followup ID brief | evidence ID [path] | finish ID head');
  }
  let config, brief;
  if (command === 'start') {
    config = JSON.parse(await readFile(resolve(target), 'utf8'));
    brief = await readFile(resolve(config.briefPath), 'utf8');
    validateConfig(config, brief);
  }
  const issue = config?.issue ?? target;
  const dir = taskDirectory(root, issue);
  await withTaskLock(dir, async () => {
    let state = await readState(dir);
    if (command === 'finish') {
      if (!state) throw new Error('Task state missing');
      state = finishTask(state, extra);
      await saveState(dir, state);
      print({ event: 'ready', issue, head: extra, cost: state.usage?.cost });
      return;
    }
    if (state && closedPhases.has(state.phase) && command === 'status') {
      print({ event: 'closed', issue, phase: state.phase });
      return;
    }
    if (command === 'start' && state) throw new Error('Task already recorded; do not recreate');
    if (command !== 'start' && !state?.agentId) throw new Error('Task agent missing; reconcile instead of launching another');
    if (state && command === 'status') requireKnownSubmission(state);
    const auth = await authenticate();
    const api = backend(auth);
    if (command === 'start') {
      state = await startTask(dir, config, brief, api);
      print({ event: 'started', issue, agentId: state.agentId, runId: state.runId, cloudUrl: state.cloudUrl });
    } else if (command === 'followup') {
      const prompt = await readFile(resolve(extra), 'utf8');
      state = await followupTask(dir, state, prompt, api);
      print({ event: 'followup_accepted', issue, runId: state.runId });
    } else if (command === 'evidence') {
      const agent = await api.resume(state);
      try {
        const artifacts = await agent.listArtifacts();
        const outputDir = join(dir, 'evidence', state.runId ?? 'uncertain-run');
        await mkdir(outputDir, { recursive: true, mode: 0o700 });
        await writeFile(join(outputDir, 'artifacts.json'), JSON.stringify(artifacts, null, 2), { mode: 0o600 });
        if (!extra) { print({ artifacts }); return; }
        const item = artifacts.find((a) => a.path === extra);
        if (!item) throw new Error('Requested file is not a listed cloud artifact');
        if (item.sizeBytes > 25 * 1024 * 1024) throw new Error('Artifact exceeds 25MB; choose a smaller report/capture');
        const bytes = await agent.downloadArtifact(item.path);
        const output = join(outputDir, `${digest(bytes).slice(0, 12)}-${basename(item.path)}`);
        await writeFile(output, bytes, { mode: 0o600 });
        await writeFile(output + '.json', JSON.stringify({ ...item, downloadedAt: new Date().toISOString(), runId: state.runId }, null, 2), { mode: 0o600 });
        print({ downloaded: output, bytes: bytes.length });
      } finally { await agent[Symbol.asyncDispose](); }
      return;
    }
    await reportStatus(dir, state, api);
  });
}

main().catch((error) => { print({ event: 'failed', error: error.message }); process.exitCode = 1; });
