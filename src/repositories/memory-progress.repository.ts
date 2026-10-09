import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../domain/progress/progress.types';
import type { PracticeCompletionCommand, ProgressRepository } from './progress.repository';

export class MemoryProgressRepository implements ProgressRepository {
  private readonly lessons = new Map<number, LessonProgress>();
  private readonly reviewItems = new Map<string, ReviewStatus>();
  private readonly practiceResults = new Map<string, PracticeResult>();
  private readonly now: () => Date;

  constructor(now: () => Date = () => new Date()) {
    this.now = now;
  }

  async getCourseProgress(): Promise<CourseProgress> {
    const lessons = [...this.lessons.values()];
    const reviewItems = [...this.reviewItems.values()];
    const results = [...this.practiceResults.values()];
    // BUG-P2-007: Exclude SELF_ASSESSED writing results from objective accuracy.
    const gradedResults = results.filter(
      (r) => (r.assessmentType ?? 'AUTO_GRADED') === 'AUTO_GRADED',
    );
    const correctAnswers = gradedResults.reduce((total, result) => total + result.correct, 0);
    const totalAnswers = gradedResults.reduce((total, result) => total + result.total, 0);
    const now = this.now().toISOString();

    return {
      lessonsCompleted: lessons.filter((lesson) => lesson.status === 'COMPLETED').length,
      lessonsInProgress: lessons.filter((lesson) => lesson.status === 'IN_PROGRESS').length,
      practiceSessions: results.length,
      correctAnswers,
      totalAnswers,
      accuracy: totalAnswers === 0 ? 0 : Math.round((correctAnswers / totalAnswers) * 100),
      reviewsDue: reviewItems.filter((item) => item.nextReviewAt <= now).length,
      vocabularyReviewed: reviewItems.filter(
        (item) => item.itemType === 'vocabulary' && item.repetitions > 0,
      ).length,
      grammarReviewed: reviewItems.filter(
        (item) => item.itemType === 'grammar' && item.repetitions > 0,
      ).length,
    };
  }

  async getLessonProgress(lessonId: number): Promise<LessonProgress | null> {
    return this.lessons.get(lessonId) ?? null;
  }

  async saveLessonProgress(progress: LessonProgress): Promise<void> {
    this.lessons.set(progress.lessonId, progress);
  }

  async getReviewItems(): Promise<ReviewStatus[]> {
    return [...this.reviewItems.values()];
  }

  async saveReviewItem(item: ReviewStatus): Promise<void> {
    this.reviewItems.set(`${item.itemType}:${item.itemId}`, item);
  }

  async savePracticeResult(result: PracticeResult): Promise<void> {
    this.practiceResults.set(result.id, result);
  }

  async commitPracticeCompletion(command: PracticeCompletionCommand): Promise<void> {
    // Idempotency: if a result with this ID already exists, skip entirely.
    if (this.practiceResults.has(command.result.id)) return;

    this.practiceResults.set(command.result.id, command.result);

    for (const item of command.reviewUpdates) {
      this.reviewItems.set(`${item.itemType}:${item.itemId}`, item);
    }

    if (command.lessonProgress) {
      this.lessons.set(command.lessonProgress.lessonId, command.lessonProgress);
    }
  }
}
