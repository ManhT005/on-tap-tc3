import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import {
  applyLessonEvent,
  calculateLessonProgress,
  emptyLessonSteps,
  getLessonRequirements,
} from './lesson-progress';
import { IndexedDbProgressRepository } from '../../repositories/indexeddb/indexeddb-progress.repository';

const occurredAt = '2026-10-11T00:00:00.000Z';

describe('lesson progress events', () => {
  it('starts at zero and requires every mandatory item plus a submitted quiz', () => {
    let progress = applyLessonEvent(null, { lessonId: 1, kind: 'opened', occurredAt });
    expect(progress.completionPercent).toBe(0);
    progress = applyLessonEvent(progress, { lessonId: 1, kind: 'quiz', occurredAt });
    expect(progress).toMatchObject({ completionPercent: 20, status: 'IN_PROGRESS' });
    const required = getLessonRequirements(1);
    for (const [kind, ids] of [
      ['recall', required.recallIds],
      ['vocabulary', required.vocabularyIds],
      ['grammar', required.grammarIds],
    ] as const) {
      for (const itemId of ids)
        progress = applyLessonEvent(progress, { lessonId: 1, kind, itemId, occurredAt });
    }
    expect(progress).toMatchObject({
      completionPercent: 100,
      status: 'COMPLETED',
      completedAt: occurredAt,
    });
    const replay = applyLessonEvent(progress, {
      lessonId: 1,
      kind: 'vocabulary',
      itemId: required.vocabularyIds[0],
      occurredAt,
    });
    expect(replay).toEqual(progress);
  });

  it('does not credit unknown IDs or round partial progress up to completion', () => {
    expect(() =>
      applyLessonEvent(null, { lessonId: 1, kind: 'grammar', itemId: 'wrong', occurredAt }),
    ).toThrow('Unknown');
    expect(calculateLessonProgress(1, { ...emptyLessonSteps(), grammarIds: ['wrong'] })).toEqual({
      completed: false,
      completionPercent: 0,
    });
  });

  it('retains historical completion evidence without inventing checklist actions', () => {
    const progress = applyLessonEvent(
      {
        lessonId: 1,
        status: 'COMPLETED',
        startedAt: occurredAt,
        updatedAt: occurredAt,
        completedAt: occurredAt,
      },
      { lessonId: 1, kind: 'opened', occurredAt },
    );
    expect(progress.legacyCompletedAt).toBe(occurredAt);
    expect(progress.steps).toEqual(emptyLessonSteps());
  });

  it('preserves simultaneous step updates across tabs and reopens with the exact checklist', async () => {
    const databaseName = crypto.randomUUID();
    const first = new IndexedDbProgressRepository({ databaseName });
    const second = new IndexedDbProgressRepository({ databaseName });
    const ids = getLessonRequirements(1).vocabularyIds.slice(0, 8);
    await Promise.all(
      ids.map((itemId, i) =>
        (i % 2 ? first : second).applyLessonEvent({
          lessonId: 1,
          kind: 'vocabulary',
          itemId,
          occurredAt,
        }),
      ),
    );
    await first.close();
    await second.close();
    const reopened = new IndexedDbProgressRepository({ databaseName });
    expect((await reopened.getLessonProgress(1))?.steps?.vocabularyIds.sort()).toEqual(ids.sort());
    await reopened.close();
  });
});
