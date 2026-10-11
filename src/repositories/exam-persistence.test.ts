import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import { MemoryProgressRepository } from './memory-progress.repository';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';
import { createExamAttempt, CORE_EXAM_BLUEPRINT } from '../domain/exam/exam-engine';
import { getExamBank } from '../domain/exam/exam-bank';

describe.each(['memory', 'indexeddb'] as const)('durable exam: %s', (adapter) => {
  it('serializes cross-instance answers and double-submit, preserving deadline and a single result', async () => {
    let now = new Date('2026-10-11T00:00:00.000Z');
    const databaseName = crypto.randomUUID();
    const first =
      adapter === 'memory'
        ? new MemoryProgressRepository(() => now)
        : new IndexedDbProgressRepository({ databaseName, now: () => now });
    const second =
      adapter === 'memory'
        ? first
        : new IndexedDbProgressRepository({ databaseName, now: () => now });
    const attempt = await first.createExamAttempt(
      createExamAttempt('exam', CORE_EXAM_BLUEPRINT, getExamBank(), 'seed', now),
    );
    await Promise.all(
      attempt.questions.slice(0, 2).map((question, i) =>
        (i ? second : first).mutateExamAttempt({
          attemptId: attempt.id,
          kind: 'answer',
          questionId: question.id,
          answer: question.correctIndex,
        }),
      ),
    );
    expect(Object.keys((await second.getActiveExamAttempt())!.answers)).toHaveLength(2);
    expect((await second.getActiveExamAttempt())!.deadlineAt).toBe(attempt.deadlineAt);
    now = new Date(attempt.deadlineAt!);
    const results = await Promise.all([
      first.submitExamAttempt(attempt.id),
      second.submitExamAttempt(attempt.id),
    ]);
    expect(results[0]).toEqual(results[1]);
    expect(results[0]!.attempt.status).toBe('EXPIRED');
    expect(results[0]!.result).toMatchObject({ correct: 2, wrong: 28, total: 30 });
    expect((await first.getCourseProgress()).practiceSessions).toBe(1);
    expect((await first.getReviewItems()).every((item) => item.repetitions === 1)).toBe(true);
    if (first instanceof IndexedDbProgressRepository) {
      await first.close();
      await (second as IndexedDbProgressRepository).close();
      const reopened = new IndexedDbProgressRepository({ databaseName });
      expect((await reopened.getActiveExamAttempt())?.status).toBe('EXPIRED');
      expect((await reopened.getPracticeResults())[0]?.questionSnapshots).toHaveLength(30);
      await reopened.close();
    }
  });
});

it('rolls back an exam result if writing its receipt fails and allows a safe retry', async () => {
  const now = new Date('2026-10-11T00:00:00.000Z');
  const repo = new IndexedDbProgressRepository({
    databaseName: crypto.randomUUID(),
    now: () => now,
  });
  const attempt = await repo.createExamAttempt(
    createExamAttempt('exam', CORE_EXAM_BLUEPRINT, getExamBank(), 'seed', now),
  );
  const original = IDBObjectStore.prototype.add;
  const failure = vi.spyOn(IDBObjectStore.prototype, 'add').mockImplementation(function (
    this: IDBObjectStore,
    value: unknown,
    key?: IDBValidKey,
  ) {
    if (this.name === 'completion_receipts')
      throw new DOMException('injected quota', 'QuotaExceededError');
    return original.call(this, value, key);
  });
  try {
    await expect(repo.submitExamAttempt(attempt.id)).rejects.toThrow('injected quota');
  } finally {
    failure.mockRestore();
  }
  expect((await repo.getCourseProgress()).practiceSessions).toBe(0);
  expect(await repo.getReviewItems()).toEqual([]);
  expect((await repo.getActiveExamAttempt())?.status).toBe('IN_PROGRESS');
  await repo.submitExamAttempt(attempt.id);
  expect((await repo.getCourseProgress()).practiceSessions).toBe(1);
  await repo.close();
});
