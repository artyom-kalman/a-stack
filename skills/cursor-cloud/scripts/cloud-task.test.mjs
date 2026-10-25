import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { finishTask, followupTask, readState, requireKnownSubmission, saveState, startTask, taskDirectory, withTaskLock } from './task-state.mjs';

const config = { issue: 'ART-TEST', repository: 'https://github.com/example/repo', ref: 'main', model: 'test', briefPath: '/brief', budgetUsd: 5, maxFollowups: 2 };

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'cloud-task-guard-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  let sends = 0, creates = 0, runStatus = 'finished', chargedCents = 100;
  const agent = { agentId: 'bc-test', async send() { sends++; return { id: `run-${sends}` }; }, async [Symbol.asyncDispose]() {} };
  const backend = {
    async create() { creates++; return agent; }, async resume() { return agent; },
    async getRun() { return { status: runStatus }; },
    async getUsage(state) { return { cost: { chargedCents }, runs: [{ runId: state.runId, cost: { chargedCents } }] }; },
  };
  return { dir, backend, agent, counts: () => ({ sends, creates }), setStatus: (s) => runStatus = s, setCost: (c) => chargedCents = c };
}

test('duplicate start does not create a second agent or paid send', async (t) => {
  const f = await fixture(t);
  await startTask(f.dir, config, 'initial task', f.backend);
  await assert.rejects(startTask(f.dir, config, 'different wording', f.backend), /already recorded/);
  assert.deepEqual(f.counts(), { sends: 1, creates: 1 });
});

test('uncertain creation is persisted and cannot be automatically retried', async (t) => {
  const f = await fixture(t);
  f.backend.create = async () => { throw new Error('response lost'); };
  await assert.rejects(startTask(f.dir, config, 'initial task', f.backend), /response lost/);
  assert.equal((await readState(f.dir)).phase, 'creating');
  await assert.rejects(startTask(f.dir, config, 'initial task', f.backend), /already recorded/);
});

test('uncertain send keeps idempotency key and blocks another follow-up', async (t) => {
  const f = await fixture(t);
  f.agent.send = async () => { throw new Error('response lost'); };
  await assert.rejects(startTask(f.dir, config, 'initial task', f.backend), /response lost/);
  const s = await readState(f.dir);
  assert.equal(s.agentId, 'bc-test');
  assert.match(s.submissions[0].idempotencyKey, /^[a-f0-9-]+$/);
  await assert.rejects(followupTask(f.dir, s, 'try again', f.backend), /Uncertain send/);
});

test('duplicate findings, active runs and third revision never send', async (t) => {
  const f = await fixture(t);
  let s = await startTask(f.dir, config, 'initial task', f.backend);
  f.setStatus('running');
  await assert.rejects(followupTask(f.dir, s, 'fix A', f.backend), /active/);
  f.setStatus('finished');
  s = await followupTask(f.dir, s, 'fix A', f.backend);
  await assert.rejects(followupTask(f.dir, s, 'fix A', f.backend), /already attempted/);
  s = await followupTask(f.dir, s, 'fix B', f.backend);
  await assert.rejects(followupTask(f.dir, s, 'fix C', f.backend), /Revision limit/);
  assert.deepEqual(f.counts(), { sends: 3, creates: 1 });
});

test('budget or unavailable usage blocks new paid work', async (t) => {
  const f = await fixture(t);
  const s = await startTask(f.dir, config, 'initial task', f.backend);
  f.setCost(500);
  await assert.rejects(followupTask(f.dir, s, 'fix A', f.backend), /budget reached/);
  f.setCost(undefined);
  await assert.rejects(followupTask(f.dir, s, 'fix A', f.backend), /unavailable/);
  assert.equal(f.counts().sends, 1);
});

test('finished review blocks new paid work and state writes remain readable', async (t) => {
  const f = await fixture(t);
  const s = await startTask(f.dir, config, 'initial task', f.backend);
  s.phase = 'ready';
  await saveState(f.dir, s);
  await assert.rejects(followupTask(f.dir, await readState(f.dir), 'fix A', f.backend), /ready/);
  assert.equal(f.counts().sends, 1);
});

test('task lock rejects concurrent mutation and releases after failure', async (t) => {
  const f = await fixture(t);
  await assert.rejects(withTaskLock(f.dir, async () => {
    await assert.rejects(withTaskLock(f.dir, async () => {}), /locked/);
    throw new Error('inner failure');
  }), /inner failure/);
  await withTaskLock(f.dir, async () => assert.equal(true, true));
  assert.throws(() => taskDirectory(f.dir, '../escape'), /Task ID/);
});

test('uncertain revision invalidates prior delivery and cannot be finished', async (t) => {
  const f = await fixture(t);
  const s = await startTask(f.dir, config, 'initial task', f.backend);
  s.phase = 'delivery'; s.result = 'old delivery';
  f.agent.send = async () => { throw new Error('response lost'); };
  await assert.rejects(followupTask(f.dir, s, 'fix A', f.backend), /response lost/);
  const pending = await readState(f.dir);
  assert.equal(pending.phase, 'submitting');
  assert.equal(pending.result, undefined);
  assert.throws(() => requireKnownSubmission(pending), /Uncertain send/);
  assert.throws(() => finishTask(pending, 'abc1234'), /Uncertain send/);
});

test('lagging billing with aggregate zero does not permit another paid run', async (t) => {
  const f = await fixture(t);
  const s = await startTask(f.dir, config, 'initial task', f.backend);
  f.backend.getUsage = async () => ({ cost: { chargedCents: 0 }, runs: [] });
  await assert.rejects(followupTask(f.dir, s, 'fix A', f.backend), /billing has not arrived/);
  assert.equal(f.counts().sends, 1);
});
