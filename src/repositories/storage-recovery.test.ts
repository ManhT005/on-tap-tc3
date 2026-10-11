import 'fake-indexeddb/auto';
import { openDB } from 'idb';
import { describe, expect, it, vi } from 'vitest';
import { MemoryProgressRepository } from './memory-progress.repository';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';
import { withStorageRecovery } from './resilient-progress.repository';
import { PROGRESS_DATABASE_VERSION } from './indexeddb/progress.database';

describe('fail-closed storage recovery', () => {
  it('rejects initial failure instead of reporting zero progress', async () => {
    const primary = new MemoryProgressRepository();
    vi.spyOn(primary, 'getCourseProgress').mockRejectedValue(new Error('storage blocked'));
    const onError = vi.fn();
    const repo = withStorageRecovery(primary, { onError });
    await expect(repo.getCourseProgress()).rejects.toThrow('storage blocked');
    expect(repo.storageStatus).toBe('unavailable');
    expect(repo.storageHealth.lastPersistedAt).toBeNull();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('keeps durable data and rejects quota writes; retry restores access to the same records', async () => {
    const primary = new MemoryProgressRepository();
    const progress = {
      lessonId: 1,
      status: 'IN_PROGRESS' as const,
      startedAt: '2026-10-11T00:00:00.000Z',
      updatedAt: '2026-10-11T00:00:00.000Z',
    };
    const repo = withStorageRecovery(primary, { now: () => new Date(progress.updatedAt) });
    await repo.saveLessonProgress(progress);
    const timestamp = repo.storageHealth.lastPersistedAt;
    const writes = vi
      .spyOn(primary, 'saveLessonProgress')
      .mockRejectedValue(new DOMException('quota', 'QuotaExceededError'));
    await expect(repo.saveLessonProgress({ ...progress, completionPercent: 99 })).rejects.toThrow(
      'quota',
    );
    expect(repo.storageHealth.lastPersistedAt).toBe(timestamp);
    const reads = vi
      .spyOn(primary, 'getCourseProgress')
      .mockRejectedValue(new Error('temporarily unavailable'));
    await expect(repo.getCourseProgress()).rejects.toThrow();
    writes.mockRestore();
    reads.mockRestore();
    await repo.retryStorage();
    expect(repo.storageStatus).toBe('persistent');
    expect(await repo.getLessonProgress(1)).toEqual(progress);
  });

  it('reports a blocked upgrade and retries the same repository after the old tab closes', async () => {
    const databaseName = crypto.randomUUID();
    const oldTab = await openDB(databaseName, 1, {
      upgrade(db) {
        db.createObjectStore('settings', { keyPath: 'key' });
      },
    });
    const repo = new IndexedDbProgressRepository({ databaseName });
    await expect(repo.getReviewItems()).rejects.toThrow('blocked');
    oldTab.close();
    await expect(repo.getReviewItems()).resolves.toEqual([]);
    await repo.close();
  });

  it('rolls back failed upgrade without deleting v1 data', async () => {
    const databaseName = crypto.randomUUID();
    const old = await openDB(databaseName, 1, {
      upgrade(db) {
        db.createObjectStore('practice_results', { keyPath: 'id' });
      },
    });
    await old.put('practice_results', { id: 'a', sessionId: 'duplicate' });
    await old.put('practice_results', { id: 'b', sessionId: 'duplicate' });
    old.close();
    const repo = new IndexedDbProgressRepository({ databaseName });
    await expect(repo.getCourseProgress()).rejects.toThrow();
    const preserved = await openDB(databaseName, 1);
    expect(preserved.version).toBe(1);
    expect(await preserved.getAll('practice_results')).toHaveLength(2);
    preserved.close();
    expect(PROGRESS_DATABASE_VERSION).toBeGreaterThan(1);
  });
});
