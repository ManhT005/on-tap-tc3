import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ReviewStatus } from '../../data/schemas';
import type { PracticeResult } from '../../domain/practice/practice.types';
import type { AppSetting, LessonProgress } from '../../domain/progress/progress.types';

export const PROGRESS_DATABASE_NAME = 'on-tap-tc3';
export const PROGRESS_DATABASE_VERSION = 1;

interface ProgressDatabase extends DBSchema {
  lesson_progress: {
    key: number;
    value: LessonProgress;
    indexes: { 'by-status': LessonProgress['status'] };
  };
  review_status: {
    key: [ReviewStatus['itemType'], string];
    value: ReviewStatus;
    indexes: { 'by-next-review': string };
  };
  practice_results: {
    key: string;
    value: PracticeResult;
    indexes: { 'by-completed-at': string; 'by-lesson-id': number };
  };
  settings: {
    key: string;
    value: AppSetting;
  };
}

export function openProgressDatabase(
  databaseName = PROGRESS_DATABASE_NAME,
): Promise<IDBPDatabase<ProgressDatabase>> {
  return openDB<ProgressDatabase>(databaseName, PROGRESS_DATABASE_VERSION, {
    upgrade(database, _oldVersion, _newVersion, transaction) {
      if (!database.objectStoreNames.contains('lesson_progress')) {
        const store = database.createObjectStore('lesson_progress', { keyPath: 'lessonId' });
        store.createIndex('by-status', 'status');
      }

      if (!database.objectStoreNames.contains('review_status')) {
        const store = database.createObjectStore('review_status', {
          keyPath: ['itemType', 'itemId'],
        });
        store.createIndex('by-next-review', 'nextReviewAt');
      }

      if (!database.objectStoreNames.contains('practice_results')) {
        const store = database.createObjectStore('practice_results', { keyPath: 'id' });
        store.createIndex('by-completed-at', 'completedAt');
        store.createIndex('by-lesson-id', 'lessonId');
      }

      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'key' });
      }

      void transaction;
    },
  });
}
