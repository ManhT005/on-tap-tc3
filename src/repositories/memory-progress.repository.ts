import type { ReviewStatus } from '../data/schemas';
import { applyReviewCommand, type ReviewCommand } from '../domain/review/review-command';
import { applyLessonEvent, type LessonEvent } from '../domain/progress/lesson-progress';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../domain/progress/progress.types';
import type { PracticeCompletionCommand, ProgressRepository } from './progress.repository';

export class MemoryProgressRepository implements ProgressRepository {
  private readonly lessons = new Map<number, LessonProgress>();
  private readonly reviewItems = new Map<string, ReviewStatus>();
  private readonly practiceResults = new Map<string, PracticeResult>();
  private readonly receipts = new Map<string, string>();
  private readonly reviewReceipts = new Map<string, ReviewStatus>();
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

  async applyLessonEvent(event: LessonEvent): Promise<LessonProgress> {
    const progress = applyLessonEvent(this.lessons.get(event.lessonId), event);
    this.lessons.set(event.lessonId, structuredClone(progress));
    return structuredClone(progress);
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

  async applyReview(command: ReviewCommand): Promise<ReviewStatus> {
    const receipt = this.reviewReceipts.get(command.eventId);
    if (receipt) return structuredClone(receipt);
    const key = `${command.itemType}:${command.itemId}`;
    const updated = applyReviewCommand(this.reviewItems.get(key), command);
    if (!updated) throw new Error('Review item is not tracked.');
    const progress = command.lessonEvent
      ? applyLessonEvent(this.lessons.get(command.lessonEvent.lessonId), command.lessonEvent)
      : undefined;
    this.reviewItems.set(key, structuredClone(updated));
    this.reviewReceipts.set(command.eventId, structuredClone(updated));
    if (progress) this.lessons.set(progress.lessonId, structuredClone(progress));
    return structuredClone(updated);
  }

  async commitPracticeCompletion(command: PracticeCompletionCommand): Promise<PracticeResult> {
    // Idempotency: if a result with this ID already exists, skip entirely.
    const existing =
      this.practiceResults.get(this.receipts.get(command.sessionId) ?? command.result.id) ??
      [...this.practiceResults.values()].find((result) => result.sessionId === command.sessionId);
    if (existing) return structuredClone(existing);

    const result = structuredClone({ ...command.result, sessionId: command.sessionId });
    const progress = command.lessonEvent
      ? applyLessonEvent(this.lessons.get(command.lessonEvent.lessonId), command.lessonEvent)
      : undefined;
    const updates = new Map(this.reviewItems);
    for (const event of command.reviewCommands) {
      const key = `${event.itemType}:${event.itemId}`;
      const updated = applyReviewCommand(updates.get(key), event);
      if (updated) updates.set(key, updated);
    }
    this.practiceResults.set(result.id, result);
    this.receipts.set(command.sessionId, result.id);

    for (const [key, item] of updates) this.reviewItems.set(key, structuredClone(item));

    if (progress) this.lessons.set(progress.lessonId, structuredClone(progress));
    return structuredClone(result);
  }
}
