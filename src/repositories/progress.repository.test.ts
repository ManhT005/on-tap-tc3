import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { LessonProgress } from '../domain/progress/progress.types';
import type { ProgressRepository } from './progress.repository';
import { MemoryProgressRepository } from './memory-progress.repository';
import { withMemoryFallback } from './resilient-progress.repository';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';

let testDatabaseId = 0;

function createRepository() {
  testDatabaseId += 1;
  return new IndexedDbProgressRepository({ databaseName: `progress-test-${testDatabaseId}` });
}

const lessonProgress: LessonProgress = {
  lessonId: 1,
  status: 'COMPLETED',
  startedAt: '2026-09-30T09:00:00.000Z',
  updatedAt: '2026-09-30T10:00:00.000Z',
  completedAt: '2026-09-30T10:00:00.000Z',
};

const vocabularyReview: ReviewStatus = {
  itemId: 'v1',
  itemType: 'vocabulary',
  repetitions: 1,
  correctCount: 1,
  wrongCount: 0,
  lastReviewedAt: '2026-09-30T09:00:00.000Z',
  nextReviewAt: '2026-09-30T10:00:00.000Z',
  intervalDays: 1,
  confidence: 3,
  box: 1,
};

const practiceResult: PracticeResult = {
  id: 'result-1',
  lessonId: 1,
  mode: 'lesson',
  score: 80,
  correct: 4,
  wrong: 1,
  total: 5,
  wrongQuestionIds: ['q5'],
  answers: { q1: 0 },
  startedAt: '2026-09-30T09:00:00.000Z',
  completedAt: '2026-09-30T10:00:00.000Z',
};

describe('IndexedDbProgressRepository', () => {
  it('persists lesson progress and reads it from a new repository instance', async () => {
    const firstRepository = createRepository();
    await firstRepository.saveLessonProgress(lessonProgress);
    await firstRepository.close();

    const reopenedRepository = new IndexedDbProgressRepository({ databaseName: 'progress-test-1' });
    await expect(reopenedRepository.getLessonProgress(1)).resolves.toEqual(lessonProgress);
    await reopenedRepository.close();
  });

  it('updates review status without colliding across item types', async () => {
    const repository = createRepository();
    await repository.saveReviewItem(vocabularyReview);
    await repository.saveReviewItem({ ...vocabularyReview, box: 2, repetitions: 2 });
    await repository.saveReviewItem({ ...vocabularyReview, itemType: 'grammar' });

    const items = await repository.getReviewItems();
    expect(items).toHaveLength(2);
    expect(items.find((item) => item.itemType === 'vocabulary')?.box).toBe(2);
    await repository.close();
  });

  it('stores practice results and aggregates course progress', async () => {
    const repository = new IndexedDbProgressRepository({
      databaseName: 'progress-course-aggregate',
      now: () => new Date('2026-10-01T00:00:00.000Z'),
    });
    await repository.saveLessonProgress(lessonProgress);
    await repository.saveReviewItem(vocabularyReview);
    await repository.savePracticeResult(practiceResult);

    await expect(repository.getCourseProgress()).resolves.toEqual({
      lessonsCompleted: 1,
      lessonsInProgress: 0,
      practiceSessions: 1,
      correctAnswers: 4,
      totalAnswers: 5,
      accuracy: 80,
      reviewsDue: 1,
      vocabularyReviewed: 1,
      grammarReviewed: 0,
    });
    await repository.close();
  });
});

describe('withMemoryFallback', () => {
  it('switches to memory storage and reports an IndexedDB failure', async () => {
    const primary: ProgressRepository = {
      getCourseProgress: vi.fn().mockRejectedValue(new Error('IndexedDB unavailable')),
      getLessonProgress: vi.fn(),
      saveLessonProgress: vi.fn(),
      getReviewItems: vi.fn(),
      saveReviewItem: vi.fn(),
      savePracticeResult: vi.fn(),
    };
    const fallback = new MemoryProgressRepository();
    const onError = vi.fn();
    const repository = withMemoryFallback(primary, fallback, { onError });

    await repository.getCourseProgress();
    await repository.saveLessonProgress(lessonProgress);
    await expect(repository.getLessonProgress(1)).resolves.toEqual(lessonProgress);
    expect(onError).toHaveBeenCalledOnce();
  });
});
