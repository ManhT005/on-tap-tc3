import legacyIds from '../../data/legacy-review-ids.v1.json';

/** Frozen snapshot: never resolve legacy positions against reordered live content. */
export const LEGACY_REVIEW_IDS: Readonly<Record<string, string>> = legacyIds;

export function getContentItemId(item: { id?: string }): string {
  if (!item.id) throw new Error('Content item has no immutable ID.');
  return item.id;
}

export function resolveContentItemId(id: string) {
  return LEGACY_REVIEW_IDS[id] ?? id;
}
