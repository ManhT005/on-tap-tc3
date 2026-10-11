import type { ReviewStatus } from '../../data/schemas';
import { applyReviewCommand, type ReviewCommand } from '../../domain/review/review-command';
import { applyLessonEvent, type LessonEvent } from '../../domain/progress/lesson-progress';
import {
  normalizeSnapshot,
  snapshotFingerprint,
  WritingDraftSchema,
  type ProgressSnapshot,
  type WritingDraft,
} from '../../domain/progress/backup';
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
    this.databasePromise ??= openProgressDatabase(this.databaseName, () => {
      this.databasePromise = undefined;
    }).catch((error: unknown) => {
      this.databasePromise = undefined;
      throw error;
    });
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
      (r) =>
        (r.assessmentType ?? (r.mode === 'writing' ? 'SELF_ASSESSED' : 'AUTO_GRADED')) ===
        'AUTO_GRADED',
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

  async getPracticeResults(): Promise<PracticeResult[]> {
    const database = await this.getDatabase();
    return (await database.getAll('practice_results')).sort((a, b) =>
      b.completedAt.localeCompare(a.completedAt),
    );
  }

  async getWritingDraft(lessonId: number, promptId: string): Promise<WritingDraft | null> {
    const database = await this.getDatabase();
    const setting = await database.get('settings', `writing-draft:${lessonId}:${promptId}`);
    return setting ? WritingDraftSchema.parse(setting.value) : null;
  }

  async saveWritingDraft(draft: WritingDraft): Promise<void> {
    WritingDraftSchema.parse(draft);
    const database = await this.getDatabase();
    const key = `writing-draft:${draft.lessonId}:${draft.promptId}`;
    const tx = database.transaction('settings', 'readwrite');
    const current = await tx.store.get(key);
    if (!current || current.updatedAt <= draft.updatedAt)
      await tx.store.put({ key, value: draft, updatedAt: draft.updatedAt });
    await tx.done;
  }

  async getSnapshot(): Promise<ProgressSnapshot> {
    const database = await this.getDatabase();
    const tx = database.transaction([
      'lesson_progress',
      'review_status',
      'practice_results',
      'completion_receipts',
      'settings',
    ]);
    const [lessons, reviewItems, results, receipts, settings] = await Promise.all([
      tx.objectStore('lesson_progress').getAll(),
      tx.objectStore('review_status').getAll(),
      tx.objectStore('practice_results').getAll(),
      tx.objectStore('completion_receipts').getAll(),
      tx.objectStore('settings').getAll(),
    ]);
    await tx.done;
    return { lessons, reviewItems, results, receipts, settings };
  }

  async restoreSnapshot(
    input: ProgressSnapshot,
    expectedCurrent?: ProgressSnapshot,
  ): Promise<void> {
    const snapshot = normalizeSnapshot(input);
    const database = await this.getDatabase();
    const tx = database.transaction(
      ['lesson_progress', 'review_status', 'practice_results', 'completion_receipts', 'settings'],
      'readwrite',
    );
    try {
      if (expectedCurrent) {
        const [lessons, reviewItems, results, receipts, settings] = await Promise.all([
          tx.objectStore('lesson_progress').getAll(),
          tx.objectStore('review_status').getAll(),
          tx.objectStore('practice_results').getAll(),
          tx.objectStore('completion_receipts').getAll(),
          tx.objectStore('settings').getAll(),
        ]);
        if (
          snapshotFingerprint({ lessons, reviewItems, results, receipts, settings }) !==
          snapshotFingerprint(expectedCurrent)
        )
          throw new Error('Data changed since backup; export again before replacing.');
      }
      for (const name of tx.objectStoreNames) await tx.objectStore(name).clear();
      for (const item of snapshot.lessons) await tx.objectStore('lesson_progress').add(item);
      for (const item of snapshot.reviewItems) await tx.objectStore('review_status').add(item);
      for (const item of snapshot.results) await tx.objectStore('practice_results').add(item);
      for (const item of snapshot.receipts) await tx.objectStore('completion_receipts').add(item);
      for (const item of snapshot.settings) await tx.objectStore('settings').add(item);
      await tx.done;
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
