import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { LessonProgress } from '../domain/progress/progress.types';
import type { PracticeCompletionCommand, ProgressRepository } from './progress.repository';
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

const reviewUpdate: ReviewStatus = {
  itemId: 'q5',
  itemType: 'question',
  repetitions: 1,
  correctCount: 0,
  wrongCount: 1,
  lastReviewedAt: '2026-09-30T10:00:00.000Z',
  nextReviewAt: '2026-09-30T10:10:00.000Z',
  intervalDays: 0,
  confidence: 1,
  box: 0,
};

function createCompletionCommand(
  overrides: Partial<PracticeCompletionCommand> = {},
): PracticeCompletionCommand {
  return {
    sessionId: 'session-1',
    result: practiceResult,
    reviewUpdates: [reviewUpdate],
    lessonProgress,
    ...overrides,
  };
}

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

  it('TC-12: does not increment vocabularyReviewed or grammarReviewed for marked-only items (repetitions = 0)', async () => {
    const repository = createRepository();
    const markedVocabulary: ReviewStatus = {
      itemId: 'v-marked',
      itemType: 'vocabulary',
      repetitions: 0,
      correctCount: 0,
      wrongCount: 0,
      lastReviewedAt: '2026-09-30T09:00:00.000Z',
      nextReviewAt: '2026-09-30T10:00:00.000Z',
      intervalDays: 0,
      confidence: 1,
      box: 0,
    };
    const markedGrammar: ReviewStatus = {
      itemId: 'g-marked',
      itemType: 'grammar',
      repetitions: 0,
      correctCount: 0,
      wrongCount: 0,
      lastReviewedAt: '2026-09-30T09:00:00.000Z',
      nextReviewAt: '2026-09-30T10:00:00.000Z',
      intervalDays: 0,
      confidence: 1,
      box: 0,
    };

    await repository.saveReviewItem(markedVocabulary);
    await repository.saveReviewItem(markedGrammar);

    const progress = await repository.getCourseProgress();
    expect(progress.vocabularyReviewed).toBe(0);
    expect(progress.grammarReviewed).toBe(0);

    // Also verify for MemoryProgressRepository
    const memoryRepo = new MemoryProgressRepository();
    await memoryRepo.saveReviewItem(markedVocabulary);
    await memoryRepo.saveReviewItem(markedGrammar);
    const memProgress = await memoryRepo.getCourseProgress();
    expect(memProgress.vocabularyReviewed).toBe(0);
    expect(memProgress.grammarReviewed).toBe(0);

    await repository.close();
  });

  it('commits practice result, review updates, and lesson progress atomically', async () => {
    const repository = createRepository();
    const command = createCompletionCommand();

    await repository.commitPracticeCompletion(command);

    const results = (await repository.getCourseProgress()).practiceSessions;
    expect(results).toBe(1);

    const reviewItems = await repository.getReviewItems();
    expect(reviewItems).toHaveLength(1);
    expect(reviewItems[0]!.itemId).toBe('q5');

    const progress = await repository.getLessonProgress(1);
    expect(progress?.status).toBe('COMPLETED');
    await repository.close();
  });

  it('is idempotent — duplicate commit with the same result ID is a no-op', async () => {
    const repository = createRepository();
    const command = createCompletionCommand();

    await repository.commitPracticeCompletion(command);
    // Submit again with same result ID
    await repository.commitPracticeCompletion({
      ...command,
      reviewUpdates: [{ ...reviewUpdate, wrongCount: 999 }],
    });

    const reviewItems = await repository.getReviewItems();
    expect(reviewItems).toHaveLength(1);
    // Original data should be preserved, not overwritten.
    expect(reviewItems[0]!.wrongCount).toBe(1);

    const courseProgress = await repository.getCourseProgress();
    expect(courseProgress.practiceSessions).toBe(1);
    await repository.close();
  });
});

describe('MemoryProgressRepository', () => {
  it('commits practice completion atomically', async () => {
    const repository = new MemoryProgressRepository();
    const command = createCompletionCommand();

    await repository.commitPracticeCompletion(command);

    const courseProgress = await repository.getCourseProgress();
    expect(courseProgress.practiceSessions).toBe(1);

    const reviewItems = await repository.getReviewItems();
    expect(reviewItems).toHaveLength(1);

    const progress = await repository.getLessonProgress(1);
    expect(progress?.status).toBe('COMPLETED');
  });

  it('is idempotent — duplicate commit is a no-op', async () => {
    const repository = new MemoryProgressRepository();
    const command = createCompletionCommand();

    await repository.commitPracticeCompletion(command);
    await repository.commitPracticeCompletion(command);

    const courseProgress = await repository.getCourseProgress();
    expect(courseProgress.practiceSessions).toBe(1);
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
      commitPracticeCompletion: vi.fn(),
    };
    const fallback = new MemoryProgressRepository();
    const onError = vi.fn();
    const repository = withMemoryFallback(primary, fallback, { onError });

    await repository.getCourseProgress();
    await repository.saveLessonProgress(lessonProgress);
    await expect(repository.getLessonProgress(1)).resolves.toEqual(lessonProgress);
    expect(onError).toHaveBeenCalledOnce();
  });

  it('delegates commitPracticeCompletion to fallback on primary failure', async () => {
    const primary: ProgressRepository = {
      getCourseProgress: vi.fn(),
      getLessonProgress: vi.fn(),
      saveLessonProgress: vi.fn(),
      getReviewItems: vi.fn(),
      saveReviewItem: vi.fn(),
      savePracticeResult: vi.fn(),
      commitPracticeCompletion: vi.fn().mockRejectedValue(new Error('IndexedDB unavailable')),
    };
    const fallback = new MemoryProgressRepository();
    const onError = vi.fn();
    const repository = withMemoryFallback(primary, fallback, { onError });

    const command = createCompletionCommand();
    await repository.commitPracticeCompletion(command);

    // Should have fallen back to memory
    expect(onError).toHaveBeenCalledOnce();

    const courseProgress = await fallback.getCourseProgress();
    expect(courseProgress.practiceSessions).toBe(1);
  });

  it('starts with unavailable status and transitions to persistent on first success', async () => {
    const primary = new MemoryProgressRepository();
    const fallback = new MemoryProgressRepository();
    const statusChanges: import('./resilient-progress.repository').StorageStatus[] = [];
    const repository = withMemoryFallback(primary, fallback, {
      onStatusChange: (s) => statusChanges.push(s),
    });

    expect(repository.storageStatus).toBe('unavailable');
    await repository.getCourseProgress();
    expect(repository.storageStatus).toBe('persistent');
    expect(statusChanges).toEqual(['persistent']);
  });

  it('transitions to degraded on primary failure and stays degraded', async () => {
    const primary: ProgressRepository = {
      getCourseProgress: vi.fn().mockRejectedValue(new Error('quota exceeded')),
      getLessonProgress: vi.fn().mockRejectedValue(new Error('quota exceeded')),
      saveLessonProgress: vi.fn(),
      getReviewItems: vi.fn(),
      saveReviewItem: vi.fn(),
      savePracticeResult: vi.fn(),
      commitPracticeCompletion: vi.fn(),
    };
    const fallback = new MemoryProgressRepository();
    const statusChanges: import('./resilient-progress.repository').StorageStatus[] = [];
    const repository = withMemoryFallback(primary, fallback, {
      onStatusChange: (s) => statusChanges.push(s),
    });

    expect(repository.storageStatus).toBe('unavailable');
    await repository.getCourseProgress(); // triggers failure
    expect(repository.storageStatus).toBe('degraded');

    // Subsequent calls go straight to fallback — primary not called again
    await repository.getLessonProgress(1); // should use fallback, not call primary again
    expect(repository.storageStatus).toBe('degraded');
    expect(statusChanges).toEqual(['degraded']); // only one transition
    expect(primary.getLessonProgress).not.toHaveBeenCalled();
  });
});
