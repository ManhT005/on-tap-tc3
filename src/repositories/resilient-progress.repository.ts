import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../domain/progress/progress.types';
import type { PracticeCompletionCommand, ProgressRepository } from './progress.repository';

/**
 * Describes the durability of the current storage backend.
 * - `persistent`: IndexedDB is healthy; data survives reload.
 * - `degraded`:   IndexedDB failed; data lives only in memory for this session.
 * - `unavailable`: Not yet determined (before first operation).
 */
export type StorageStatus = 'persistent' | 'degraded' | 'unavailable';

export type ResilientProgressRepositoryOptions = {
  onError?: (error: unknown) => void;
  onStatusChange?: (status: StorageStatus) => void;
};

export type ResilientProgressRepository = ProgressRepository & {
  readonly storageStatus: StorageStatus;
};

export function withMemoryFallback(
  primary: ProgressRepository,
  fallback: ProgressRepository,
  options: ResilientProgressRepositoryOptions = {},
): ResilientProgressRepository {
  let storageStatus: StorageStatus = 'unavailable';

  function setStatus(next: StorageStatus) {
    if (storageStatus !== next) {
      storageStatus = next;
      options.onStatusChange?.(next);
    }
  }

  async function run<T>(primaryAction: () => Promise<T>, fallbackAction: () => Promise<T>) {
    if (storageStatus === 'degraded') return fallbackAction();

    try {
      const result = await primaryAction();
      setStatus('persistent');
      return result;
    } catch (error) {
      setStatus('degraded');
      options.onError?.(error);
      if (import.meta.env.DEV) {
        console.error('IndexedDB progress storage failed; using memory for this session.', error);
      }
      return fallbackAction();
    }
  }

  const repo: ResilientProgressRepository = {
    get storageStatus() {
      return storageStatus;
    },
    getCourseProgress: (): Promise<CourseProgress> =>
      run(
        () => primary.getCourseProgress(),
        () => fallback.getCourseProgress(),
      ),
    getLessonProgress: (lessonId: number): Promise<LessonProgress | null> =>
      run(
        () => primary.getLessonProgress(lessonId),
        () => fallback.getLessonProgress(lessonId),
      ),
    saveLessonProgress: (progress: LessonProgress): Promise<void> =>
      run(
        () => primary.saveLessonProgress(progress),
        () => fallback.saveLessonProgress(progress),
      ),
    getReviewItems: (): Promise<ReviewStatus[]> =>
      run(
        () => primary.getReviewItems(),
        () => fallback.getReviewItems(),
      ),
    saveReviewItem: (item: ReviewStatus): Promise<void> =>
      run(
        () => primary.saveReviewItem(item),
        () => fallback.saveReviewItem(item),
      ),
    savePracticeResult: (result: PracticeResult): Promise<void> =>
      run(
        () => primary.savePracticeResult(result),
        () => fallback.savePracticeResult(result),
      ),
    commitPracticeCompletion: (command: PracticeCompletionCommand): Promise<void> =>
      run(
        () => primary.commitPracticeCompletion(command),
        () => fallback.commitPracticeCompletion(command),
      ),
  };

  return repo;
}
