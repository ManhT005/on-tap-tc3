import type { ReviewStatus } from '../../data/schemas';
import type { PracticeResult } from '../../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../../domain/progress/progress.types';
import type { ProgressRepository } from '../progress.repository';
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
    const correctAnswers = results.reduce((total, result) => total + result.correct, 0);
    const totalAnswers = results.reduce((total, result) => total + result.total, 0);
    const now = this.now().toISOString();

    return {
      lessonsCompleted: lessons.filter((lesson) => lesson.status === 'COMPLETED').length,
      lessonsInProgress: lessons.filter((lesson) => lesson.status === 'IN_PROGRESS').length,
      practiceSessions: results.length,
      correctAnswers,
      totalAnswers,
      accuracy: totalAnswers === 0 ? 0 : Math.round((correctAnswers / totalAnswers) * 100),
      reviewsDue: reviewItems.filter((item) => item.nextReviewAt <= now).length,
      vocabularyReviewed: reviewItems.filter((item) => item.itemType === 'vocabulary').length,
      grammarReviewed: reviewItems.filter((item) => item.itemType === 'grammar').length,
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

  async close(): Promise<void> {
    if (this.databasePromise) {
      (await this.databasePromise).close();
      this.databasePromise = undefined;
    }
  }
}
