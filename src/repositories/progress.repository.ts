import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../domain/progress/progress.types';

export interface ProgressRepository {
  getCourseProgress(): Promise<CourseProgress>;
  getLessonProgress(lessonId: number): Promise<LessonProgress | null>;
  saveLessonProgress(progress: LessonProgress): Promise<void>;
  getReviewItems(): Promise<ReviewStatus[]>;
  saveReviewItem(item: ReviewStatus): Promise<void>;
  savePracticeResult(result: PracticeResult): Promise<void>;
}
