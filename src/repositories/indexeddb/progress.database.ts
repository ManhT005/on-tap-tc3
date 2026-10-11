import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ReviewStatus } from '../../data/schemas';
import type { PracticeResult } from '../../domain/practice/practice.types';
import type { AppSetting, LessonProgress } from '../../domain/progress/progress.types';
import { migrateReviewIdentities } from './migrate-review-identities';

export const PROGRESS_DATABASE_NAME = 'on-tap-tc3';
export const PROGRESS_DATABASE_VERSION = 3;

export interface ProgressDatabase extends DBSchema {
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
    indexes: { 'by-completed-at': string; 'by-lesson-id': number; 'by-session-id': string };
  };
  completion_receipts: {
    key: string;
    value: { sessionId: string; resultId: string; completedAt: string };
  };
  settings: {
    key: string;
    value: AppSetting;
  };
}

export function openProgressDatabase(
  databaseName = PROGRESS_DATABASE_NAME,
  onInvalidated?: () => void,
): Promise<IDBPDatabase<ProgressDatabase>> {
  let opened: IDBPDatabase<ProgressDatabase> | undefined;
  let blocked = false;
  let rejectBlocked: (error: Error) => void = () => undefined;
  const unavailable = new Promise<never>((_resolve, reject) => {
    rejectBlocked = reject;
  });
  const opening = openDB<ProgressDatabase>(databaseName, PROGRESS_DATABASE_VERSION, {
    blocked() {
      blocked = true;
      rejectBlocked(new Error('Database upgrade blocked. Close other tabs and retry.'));
    },
    blocking() {
      opened?.close();
      onInvalidated?.();
    },
    terminated() {
      onInvalidated?.();
    },
    upgrade(database, _oldVersion, _newVersion, transaction) {
      // idb exposes a separate completion promise for the upgrade transaction.
      // openDB reports failure too; observe both so aborts never leak rejections.
      void transaction.done.catch(() => undefined);
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

      const results = transaction.objectStore('practice_results');
      if (!results.indexNames.contains('by-session-id')) {
        // IndexedDB skips records with no sessionId: keep v1 records unchanged.
        results.createIndex('by-session-id', 'sessionId', { unique: true });
      }
      if (!database.objectStoreNames.contains('completion_receipts')) {
        database.createObjectStore('completion_receipts', { keyPath: 'sessionId' });
      }
      // Only IndexedDB requests are awaited; migration stays in the upgrade tx.
      void migrateReviewIdentities(transaction).catch(() => {
        try {
          transaction.abort();
        } catch {
          /* transaction already aborted */
        }
      });
    },
  }).then((database) => {
    opened = database;
    if (blocked) {
      database.close();
      throw new Error('Database upgrade was blocked; retry.');
    }
    return database;
  });
  return Promise.race([opening, unavailable]);
}
