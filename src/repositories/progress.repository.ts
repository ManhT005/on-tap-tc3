import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../domain/progress/progress.types';

/**
 * Command to atomically commit all data from a completed practice session.
 * IndexedDB implementations must write all fields in a single transaction
 * to prevent partial state when individual saves fail.
 */
export type PracticeCompletionCommand = {
  /** Stable session ID used for idempotency — duplicate commits are no-ops. */
  sessionId: string;
  result: PracticeResult;
  reviewUpdates: ReviewStatus[];
  lessonProgress?: LessonProgress;
};

export interface ProgressRepository {
  getCourseProgress(): Promise<CourseProgress>;
  getLessonProgress(lessonId: number): Promise<LessonProgress | null>;
  saveLessonProgress(progress: LessonProgress): Promise<void>;
  getReviewItems(): Promise<ReviewStatus[]>;
  saveReviewItem(item: ReviewStatus): Promise<void>;
  savePracticeResult(result: PracticeResult): Promise<void>;

  /**
   * Atomically commit a practice session's result, review updates, and lesson
   * progress in a single transaction. Idempotent — if a result with the same
   * sessionId already exists, the call is a no-op.
   */
  commitPracticeCompletion(command: PracticeCompletionCommand): Promise<void>;
}
