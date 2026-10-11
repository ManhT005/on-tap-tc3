import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { MemoryProgressRepository } from './memory-progress.repository';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';
import { createBackup, parseBackup, type ProgressSnapshot } from '../domain/progress/backup';
import { completePracticeSession } from '../domain/practice/complete-practice';
import { resetLessonSnapshot } from '../domain/progress/reset-lesson-snapshot';

const empty: ProgressSnapshot = {
  lessons: [],
  reviewItems: [],
  results: [],
  receipts: [],
  settings: [],
};

it('resets one lesson while preserving other lessons and drafts', () => {
  const snapshot = {
    ...empty,
    settings: [
      {
        key: 'writing-draft:1:w1',
        value: {
          lessonId: 1,
          promptId: 'w1',
          response: 'one',
          updatedAt: '2026-10-11T00:00:00.000Z',
        },
        updatedAt: '2026-10-11T00:00:00.000Z',
      },
      {
        key: 'writing-draft:2:w2',
        value: {
          lessonId: 2,
          promptId: 'w2',
          response: 'two',
          updatedAt: '2026-10-11T00:00:00.000Z',
        },
        updatedAt: '2026-10-11T00:00:00.000Z',
      },
    ],
  };
  expect(resetLessonSnapshot(snapshot, 1).settings).toEqual([snapshot.settings[1]]);
});

describe.each(['memory', 'indexeddb'] as const)('backup and writing drafts: %s', (adapter) => {
  function repo() {
    return adapter === 'memory'
      ? new MemoryProgressRepository()
      : new IndexedDbProgressRepository({ databaseName: crypto.randomUUID() });
  }
  it('round trips drafts, submitted text, question snapshots and completion receipts', async () => {
    const original = repo();
    const restored = repo();
    await original.saveWritingDraft({
      lessonId: 1,
      promptId: 'w1',
      response: '안녕하세요.',
      updatedAt: '2026-10-11T00:00:00.000Z',
    });
    const session = {
      id: 'writing-session',
      mode: 'writing' as const,
      lessonId: 1,
      questionIds: ['w1'],
      answers: { w1: 1 },
      startedAt: '2026-10-11T00:00:00.000Z',
    };
    const result = await completePracticeSession(
      session,
      [
        {
          id: 'w1',
          correctIndex: 1,
          question: 'Giới thiệu bản thân',
          options: ['Cần luyện thêm', 'Đạt'],
        },
      ],
      original,
      {
        resultId: 'writing-result',
        completedAt: '2026-10-11T00:01:00.000Z',
        assessmentType: 'SELF_ASSESSED',
        responses: { w1: '안녕하세요.' },
      },
    );
    await restored.restoreSnapshot(
      parseBackup(JSON.stringify(createBackup(await original.getSnapshot()))),
    );
    expect(await restored.getWritingDraft(1, 'w1')).toMatchObject({ response: '안녕하세요.' });
    expect(await restored.getPracticeResults()).toEqual([result]);
    expect((await restored.getCourseProgress()).accuracy).toBe(0);
    const replay = await restored.commitPracticeCompletion({
      sessionId: session.id,
      result: { ...result, id: 'retry' },
      reviewCommands: [],
    });
    expect(replay.id).toBe(result.id);
    if (original instanceof IndexedDbProgressRepository) {
      await original.close();
      await (restored as IndexedDbProgressRepository).close();
    }
  });

  it('rejects invalid import and a stale replacement without touching existing data', async () => {
    const repository = repo();
    const before = await repository.getSnapshot();
    await repository.saveWritingDraft({
      lessonId: 1,
      promptId: 'w1',
      response: '새 글',
      updatedAt: '2026-10-11T00:00:00.000Z',
    });
    await expect(repository.restoreSnapshot(empty, before)).rejects.toThrow('Data changed');
    await expect(
      repository.restoreSnapshot({
        ...empty,
        lessons: [{ lessonId: 99 }],
      } as unknown as ProgressSnapshot),
    ).rejects.toThrow();
    expect(await repository.getWritingDraft(1, 'w1')).toMatchObject({ response: '새 글' });
    if (repository instanceof IndexedDbProgressRepository) await repository.close();
  });
});

it('accepts compatible v1/v2 envelopes and rejects incompatible, corrupt or oversized backups', () => {
  for (const schemaVersion of [1, 2])
    expect(parseBackup(JSON.stringify({ ...createBackup(empty), schemaVersion }))).toEqual(empty);
  expect(() => parseBackup('not JSON')).toThrow();
  expect(() =>
    parseBackup(JSON.stringify({ ...createBackup(empty), schemaVersion: 99 })),
  ).toThrow();
  expect(() => parseBackup('x'.repeat(10 * 1024 * 1024 + 1))).toThrow('exceeds');
});
