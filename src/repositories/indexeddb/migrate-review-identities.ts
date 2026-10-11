import type { IDBPTransaction, StoreNames } from 'idb';
import type { ProgressDatabase } from './progress.database';
import { resolveContentItemId } from '../../domain/review/content-identity';

export async function migrateReviewIdentities(
  transaction: IDBPTransaction<
    ProgressDatabase,
    Array<StoreNames<ProgressDatabase>>,
    'versionchange'
  >,
) {
  const store = transaction.objectStore('review_status');
  const settings = transaction.objectStore('settings');
  for (const item of await store.getAll()) {
    if (item.itemType === 'question') continue;
    const stableId = resolveContentItemId(item.itemId);
    if (stableId === item.itemId) continue; // Keep unresolved records for recovery.
    const existing = await store.get([item.itemType, stableId]);
    const migrated = { ...item, itemId: stableId };
    if (existing) {
      // Identity collisions cannot prove distinct events. Keep the more complete
      // history; archive both originals rather than inventing combined counters.
      await settings.put({
        key: `migration:v3:${item.itemType}:${item.itemId}`,
        value: { legacy: item, canonical: existing },
        updatedAt: item.lastReviewedAt,
      });
    }
    const selected =
      existing &&
      (existing.repetitions > migrated.repetitions ||
        (existing.repetitions === migrated.repetitions &&
          existing.lastReviewedAt >= migrated.lastReviewedAt))
        ? existing
        : migrated;
    await store.put(selected);
    await store.delete([item.itemType, item.itemId]);
  }
}
