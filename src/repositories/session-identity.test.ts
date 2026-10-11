import 'fake-indexeddb/auto';
import { openDB } from 'idb';
import { describe, expect, it } from 'vitest';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';
import { MemoryProgressRepository } from './memory-progress.repository';
import { PROGRESS_DATABASE_VERSION } from './indexeddb/progress.database';
import type { PracticeCompletionCommand } from './progress.repository';

function command(sessionId: string, resultId: string): PracticeCompletionCommand {
  return {
    sessionId,
    result: {
      id: resultId,
      mode: 'quiz',
      score: 0,
      correct: 0,
      wrong: 1,
      total: 1,
      wrongQuestionIds: ['1'],
      answers: { '1': 1 },
      startedAt: '2026-10-11T00:00:00.000Z',
      completedAt: '2026-10-11T00:01:00.000Z',
    },
    reviewCommands: [],
  };
}

describe.each(['memory', 'indexeddb'] as const)('session identity: %s', (adapter) => {
  function create() {
    return adapter === 'memory'
      ? new MemoryProgressRepository()
      : new IndexedDbProgressRepository({ databaseName: crypto.randomUUID() });
  }

  it('returns the original result for the same session with a changed result ID', async () => {
    const repo = create();
    const first = await repo.commitPracticeCompletion(command('session', 'first'));
    const replay = await repo.commitPracticeCompletion(command('session', 'retry'));
    expect(replay).toEqual(first);
    expect((await repo.getCourseProgress()).practiceSessions).toBe(1);
    if (repo instanceof IndexedDbProgressRepository) await repo.close();
  });

  it('serializes concurrent duplicate sessions and preserves different sessions', async () => {
    const repo = create();
    await Promise.all([
      repo.commitPracticeCompletion(command('a', 'a1')),
      repo.commitPracticeCompletion(command('a', 'a2')),
      repo.commitPracticeCompletion(command('b', 'b1')),
    ]);
    expect((await repo.getCourseProgress()).practiceSessions).toBe(2);
    if (repo instanceof IndexedDbProgressRepository) await repo.close();
  });
});

it('deduplicates across two database instances and after reopening', async () => {
  const databaseName = crypto.randomUUID();
  const first = new IndexedDbProgressRepository({ databaseName });
  const second = new IndexedDbProgressRepository({ databaseName });
  const results = await Promise.all([
    first.commitPracticeCompletion(command('session', 'first')),
    second.commitPracticeCompletion(command('session', 'second')),
  ]);
  expect(results[0]).toEqual(results[1]);
  await first.close();
  await second.close();
  const reopened = new IndexedDbProgressRepository({ databaseName });
  expect(await reopened.commitPracticeCompletion(command('session', 'third'))).toEqual(results[0]);
  expect((await reopened.getCourseProgress()).practiceSessions).toBe(1);
  await reopened.close();
});

it('upgrades v1 without inventing session identity or deleting legacy data', async () => {
  const databaseName = crypto.randomUUID();
  const legacy = command('unknown', 'legacy').result;
  const db = await openDB(databaseName, 1, {
    upgrade(database) {
      const results = database.createObjectStore('practice_results', { keyPath: 'id' });
      results.createIndex('by-completed-at', 'completedAt');
      results.createIndex('by-lesson-id', 'lessonId');
    },
  });
  await db.put('practice_results', legacy);
  db.close();
  const repo = new IndexedDbProgressRepository({ databaseName });
  await repo.commitPracticeCompletion(command('new', 'new'));
  expect((await repo.getCourseProgress()).practiceSessions).toBe(2);
  await repo.close();
  const migrated = await openDB(databaseName, PROGRESS_DATABASE_VERSION);
  expect(await migrated.get('practice_results', 'legacy')).toEqual(legacy);
  expect(migrated.transaction('practice_results').store.index('by-session-id').unique).toBe(true);
  migrated.close();
});
