import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../domain/progress/progress.types';
import type { PracticeCompletionCommand, ProgressRepository } from './progress.repository';

export type ResilientProgressRepositoryOptions = {
  onError?: (error: unknown) => void;
};

export function withMemoryFallback(
  primary: ProgressRepository,
  fallback: ProgressRepository,
  options: ResilientProgressRepositoryOptions = {},
): ProgressRepository {
  let useFallback = false;

  async function run<T>(primaryAction: () => Promise<T>, fallbackAction: () => Promise<T>) {
    if (useFallback) return fallbackAction();

    try {
      return await primaryAction();
    } catch (error) {
      useFallback = true;
      options.onError?.(error);
      if (import.meta.env.DEV) {
        console.error('IndexedDB progress storage failed; using memory for this session.', error);
      }
      return fallbackAction();
    }
  }

  return {
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
}
