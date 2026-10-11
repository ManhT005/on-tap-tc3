import type { ReviewStatus } from '../../data/schemas';
import { applyReviewCommand, type ReviewCommand } from '../../domain/review/review-command';
import { applyLessonEvent, type LessonEvent } from '../../domain/progress/lesson-progress';
import type { PracticeResult } from '../../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../../domain/progress/progress.types';
import type { PracticeCompletionCommand, ProgressRepository } from '../progress.repository';
import { openProgressDatabase } from './progress.database';

export type IndexedDbProgressRepositoryOptions = {
  databaseName?: string;
  now?: () => Date;
};

export class IndexedDbProgressRepository implements ProgressRepository {
  private readonly databaseName?: string;
  private readonly now: () => Date;
  private databasePromise: ReturnType<typeof openProgressDatabase> | undefined;

  constructor(options: IndexedDbProgressRepositoryOptions = {}) {
    this.databaseName = options.databaseName;
    this.now = options.now ?? (() => new Date());
  }

  private getDatabase() {
    this.databasePromise ??= openProgressDatabase(this.databaseName);
    return this.databasePromise;
  }

  async getCourseProgress(): Promise<CourseProgress> {
    const database = await this.getDatabase();
    const [lessons, reviewItems, results] = await Promise.all([
      database.getAll('lesson_progress'),
      database.getAll('review_status'),
      database.getAll('practice_results'),
    ]);
    // BUG-P2-007: Exclude SELF_ASSESSED writing results from objective accuracy.
    // Legacy results without assessmentType are treated as AUTO_GRADED.
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
    const database = await this.getDatabase();
    return (await database.get('lesson_progress', lessonId)) ?? null;
  }

  async saveLessonProgress(progress: LessonProgress): Promise<void> {
    const database = await this.getDatabase();
    await database.put('lesson_progress', progress);
  }

  async applyLessonEvent(event: LessonEvent): Promise<LessonProgress> {
    const database = await this.getDatabase();
    const tx = database.transaction('lesson_progress', 'readwrite');
    try {
      const progress = applyLessonEvent(await tx.store.get(event.lessonId), event);
      await tx.store.put(progress);
      await tx.done;
      return progress;
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* already aborted */
      }
      await tx.done.catch(() => undefined);
      throw error;
    }
  }

  async getReviewItems(): Promise<ReviewStatus[]> {
    const database = await this.getDatabase();
    return database.getAll('review_status');
  }

  async saveReviewItem(item: ReviewStatus): Promise<void> {
    const database = await this.getDatabase();
    await database.put('review_status', item);
  }

  async savePracticeResult(result: PracticeResult): Promise<void> {
    const database = await this.getDatabase();
    await database.put('practice_results', result);
  }

  async applyReview(command: ReviewCommand): Promise<ReviewStatus> {
    const database = await this.getDatabase();
    const tx = database.transaction(['review_status', 'settings', 'lesson_progress'], 'readwrite');
    try {
      const key = `review-event:${command.eventId}`;
      const receipt = await tx.objectStore('settings').get(key);
      if (receipt) {
        await tx.done;
        return receipt.value as ReviewStatus;
      }
      const store = tx.objectStore('review_status');
      const current = await store.get([command.itemType, command.itemId]);
      const updated = applyReviewCommand(current, command);
      if (!updated) throw new Error('Review item is not tracked.');
      await store.put(updated);
      if (command.lessonEvent) {
        const lessons = tx.objectStore('lesson_progress');
        const progress = applyLessonEvent(
          await lessons.get(command.lessonEvent.lessonId),
          command.lessonEvent,
        );
        await lessons.put(progress);
      }
      await tx.objectStore('settings').add({ key, value: updated, updatedAt: command.gradedAt });
      await tx.done;
      return updated;
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* already aborted */
      }
      await tx.done.catch(() => undefined);
      throw error;
    }
  }

  async commitPracticeCompletion(command: PracticeCompletionCommand): Promise<PracticeResult> {
    const database = await this.getDatabase();
    const tx = database.transaction(
      ['practice_results', 'review_status', 'lesson_progress', 'completion_receipts'],
      'readwrite',
    );

    try {
      const receipt = await tx.objectStore('completion_receipts').get(command.sessionId);
      const results = tx.objectStore('practice_results');
      const existing = receipt
        ? await results.get(receipt.resultId)
        : ((await results.index('by-session-id').get(command.sessionId)) ??
          (await results.get(command.result.id)));
      if (existing) {
        // Already committed — treat as no-op.
        await tx.done;
        return existing;
      }

      // All writes happen inside this single transaction — any failure
      // causes the entire transaction to roll back automatically.
      const result = { ...command.result, sessionId: command.sessionId };
      await results.add(result);
      await tx.objectStore('completion_receipts').add({
        sessionId: command.sessionId,
        resultId: result.id,
        completedAt: result.completedAt,
      });

      for (const event of command.reviewCommands) {
        const store = tx.objectStore('review_status');
        const current = await store.get([event.itemType, event.itemId]);
        const updated = applyReviewCommand(current, event);
        if (updated) await store.put(updated);
      }

      if (command.lessonEvent) {
        const lessons = tx.objectStore('lesson_progress');
        await lessons.put(
          applyLessonEvent(await lessons.get(command.lessonEvent.lessonId), command.lessonEvent),
        );
      }

      await tx.done;
      return result;
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* already aborted */
      }
      await tx.done.catch(() => undefined);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.databasePromise) {
      (await this.databasePromise).close();
      this.databasePromise = undefined;
    }
  }
}
