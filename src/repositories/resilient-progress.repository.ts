import type { ProgressRepository } from './progress.repository';

export type StorageStatus = 'persistent' | 'degraded' | 'unavailable';
export type StorageHealth = {
  status: StorageStatus;
  lastPersistedAt: string | null;
  error: unknown | null;
};
export type StorageRecoveryOptions = {
  onError?: (error: unknown) => void;
  onStatusChange?: (status: StorageStatus) => void;
  now?: () => Date;
};
export type ResilientProgressRepository = ProgressRepository & {
  readonly storageStatus: StorageStatus;
  readonly storageHealth: StorageHealth;
  retryStorage(): Promise<void>;
};

/** Fail closed: never replace durable data with an empty memory repository. */
export function withStorageRecovery(
  primary: ProgressRepository,
  options: StorageRecoveryOptions = {},
): ResilientProgressRepository {
  let health: StorageHealth = { status: 'unavailable', lastPersistedAt: null, error: null };
  function setStatus(status: StorageStatus) {
    if (health.status !== status) options.onStatusChange?.(status);
    health = { ...health, status };
  }
  async function run<T>(action: () => Promise<T>, write = false): Promise<T> {
    try {
      const result = await action();
      health = {
        ...health,
        error: null,
        lastPersistedAt: write
          ? (options.now?.() ?? new Date()).toISOString()
          : health.lastPersistedAt,
      };
      setStatus('persistent');
      if (write && typeof window !== 'undefined')
        window.dispatchEvent(new Event('tc3-progress-changed'));
      return result;
    } catch (error) {
      health = { ...health, error };
      setStatus('unavailable');
      options.onError?.(error);
      throw error;
    }
  }
  return {
    get storageStatus() {
      return health.status;
    },
    get storageHealth() {
      return { ...health };
    },
    retryStorage: async () => {
      await run(() => primary.getCourseProgress());
    },
    getCourseProgress: () => run(() => primary.getCourseProgress()),
    getLessonProgress: (lessonId) => run(() => primary.getLessonProgress(lessonId)),
    saveLessonProgress: (progress) => run(() => primary.saveLessonProgress(progress), true),
    applyLessonEvent: (event) => run(() => primary.applyLessonEvent(event), true),
    getReviewItems: () => run(() => primary.getReviewItems()),
    saveReviewItem: (item) => run(() => primary.saveReviewItem(item), true),
    applyReview: (command) => run(() => primary.applyReview(command), true),
    savePracticeResult: (result) => run(() => primary.savePracticeResult(result), true),
    getPracticeResults: () => run(() => primary.getPracticeResults()),
    getWritingDraft: (lessonId, promptId) => run(() => primary.getWritingDraft(lessonId, promptId)),
    saveWritingDraft: (draft) => run(() => primary.saveWritingDraft(draft), true),
    getSnapshot: () => run(() => primary.getSnapshot()),
    restoreSnapshot: (snapshot, expectedCurrent) =>
      run(() => primary.restoreSnapshot(snapshot, expectedCurrent), true),
    commitPracticeCompletion: (command) =>
      run(() => primary.commitPracticeCompletion(command), true),
  };
}
