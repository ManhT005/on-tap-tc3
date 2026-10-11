import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import { MemoryProgressRepository } from './memory-progress.repository';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';
import { serializeBackup, parseBackup } from '../domain/progress/backup';
import { resetLessonSnapshot } from '../domain/progress/reset-lesson-snapshot';
import type { VocabularySession } from '../domain/vocabulary/vocabulary-session';

const initial: VocabularySession = {
  id: 'vocab-batch',
  lessonId: 1,
  itemIds: ['vocab-01-0001', 'vocab-01-0002'],
  batchSize: 5,
  cursor: 0,
  grades: {},
  startedAt: '2026-10-11T00:00:00.000Z',
  updatedAt: '2026-10-11T00:00:00.000Z',
};
it('rolls back session, lesson, SRS and receipt on a late IndexedDB write failure', async () => {
  const repository = new IndexedDbProgressRepository({ databaseName: crypto.randomUUID() });
  await repository.startVocabularySession(initial);
  const original = IDBObjectStore.prototype.put;
  const spy = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (
    this: IDBObjectStore,
    value,
    key,
  ) {
    if (this.name === 'settings' && value.key === 'vocabulary-session:1')
      throw new DOMException('quota', 'QuotaExceededError');
    return original.call(this, value, key);
  });
  try {
    await expect(
      repository.mutateVocabularySession({
        kind: 'grade',
        sessionId: initial.id,
        lessonId: 1,
        itemId: initial.itemIds[0]!,
        confidence: 4,
        occurredAt: initial.updatedAt,
      }),
    ).rejects.toThrow();
  } finally {
    spy.mockRestore();
  }
  expect(await repository.getReviewItems()).toEqual([]);
  expect(await repository.getLessonProgress(1)).toBeNull();
  expect((await repository.getVocabularySession(1))?.grades).toEqual({});
  expect(
    (await repository.getSnapshot()).settings.filter((setting) =>
      setting.key.startsWith('review-event:'),
    ),
  ).toHaveLength(0);
  await repository.close();
});
for (const adapter of ['memory', 'indexeddb'])
  describe(`${adapter} vocabulary persistence`, () => {
    it('serializes competing grades, resumes, backs up/restores and resets one lesson', async () => {
      const name = crypto.randomUUID();
      const first =
        adapter === 'memory'
          ? new MemoryProgressRepository()
          : new IndexedDbProgressRepository({ databaseName: name });
      const second =
        adapter === 'memory' ? first : new IndexedDbProgressRepository({ databaseName: name });
      await first.startVocabularySession(initial);
      const mutation = {
        sessionId: initial.id,
        lessonId: 1,
        kind: 'grade' as const,
        itemId: initial.itemIds[0]!,
        confidence: 4 as const,
        occurredAt: '2026-10-11T01:00:00.000Z',
      };
      await Promise.all([
        first.mutateVocabularySession(mutation),
        second.mutateVocabularySession({ ...mutation, confidence: 1 }),
      ]);
      expect((await second.getReviewItems())[0]).toMatchObject({ repetitions: 1, confidence: 4 });
      expect((await second.getVocabularySession(1))?.grades).toEqual({ 'vocab-01-0001': 4 });
      expect((await first.getLessonProgress(1))?.steps?.vocabularyIds).toEqual(['vocab-01-0001']);
      const snapshot = await first.getSnapshot();
      const restored = new MemoryProgressRepository();
      await restored.restoreSnapshot(parseBackup(serializeBackup(snapshot)));
      expect(await restored.getVocabularySession(1)).toEqual(await first.getVocabularySession(1));
      await restored.restoreSnapshot(resetLessonSnapshot(snapshot, 1));
      expect(await restored.getVocabularySession(1)).toBeNull();
      expect(await restored.getReviewItems()).toHaveLength(0);
      await expect(
        first.mutateVocabularySession({ ...mutation, itemId: 'vocab-02-0001' }),
      ).rejects.toThrow();
      expect((await first.getReviewItems())[0]?.repetitions).toBe(1);
    });
  });
