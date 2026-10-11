import 'fake-indexeddb/auto';
import { openDB } from 'idb';
import { describe, expect, it } from 'vitest';
import { LESSONS_DATA } from '../data/lessons';
import { getReviewPrompt } from '../domain/review/review-content';
import { createReviewStatus } from '../domain/review/review-engine';
import { getContentItemId, resolveContentItemId } from '../domain/review/content-identity';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';

describe('immutable content identity', () => {
  it('has unique explicit identities for every vocabulary and grammar item', () => {
    const ids = Object.values(LESSONS_DATA).flatMap((lesson) => [
      ...lesson.vocabulary.flatMap((pack) => pack.items.map(getContentItemId)),
      ...lesson.grammar.map(getContentItemId),
    ]);
    expect(ids).toHaveLength(1127);
    expect(new Set(ids).size).toBe(ids.length);
    // Same text and distinct meanings keep their independently assigned IDs.
    expect(getContentItemId({ id: 'a' })).not.toBe(getContentItemId({ id: 'b' }));
  });

  it('resolves both immutable and frozen legacy references after reordering content', () => {
    const lesson = LESSONS_DATA[1]!;
    const original = structuredClone(lesson.vocabulary);
    try {
      lesson.vocabulary.reverse();
      for (const pack of lesson.vocabulary) pack.items.reverse();
      const legacy = createReviewStatus('lesson-1-vocabulary-0-0', 'vocabulary', new Date());
      expect(getReviewPrompt(legacy)).toMatchObject({ prompt: '학기', answer: 'Học kỳ' });
      expect(getReviewPrompt({ ...legacy, itemId: resolveContentItemId(legacy.itemId) })).toEqual(
        getReviewPrompt(legacy),
      );
    } finally {
      lesson.vocabulary = original;
    }
  });

  it('migrates old IDs, archives collisions and retains unresolved records', async () => {
    const databaseName = crypto.randomUUID();
    const db = await openDB(databaseName, 1, {
      upgrade(database) {
        database.createObjectStore('review_status', { keyPath: ['itemType', 'itemId'] });
      },
    });
    const old = createReviewStatus('lesson-1-vocabulary-0-0', 'vocabulary', new Date());
    const canonical = {
      ...old,
      itemId: resolveContentItemId(old.itemId),
      repetitions: 3,
      correctCount: 3,
    };
    const orphan = { ...old, itemId: 'unknown-legacy-item' };
    await db.put('review_status', old);
    await db.put('review_status', canonical);
    await db.put('review_status', orphan);
    db.close();
    const repo = new IndexedDbProgressRepository({ databaseName });
    expect(await repo.getReviewItems()).toEqual(expect.arrayContaining([canonical, orphan]));
    expect(await repo.getReviewItems()).toHaveLength(2);
    await repo.close();
    const migrated = await openDB(databaseName);
    const archive = await migrated.get('settings', `migration:v3:vocabulary:${old.itemId}`);
    expect(archive.value).toEqual({ legacy: old, canonical });
    migrated.close();
    const reopened = new IndexedDbProgressRepository({ databaseName });
    expect(await reopened.getReviewItems()).toHaveLength(2);
    await reopened.close();
  });
});
