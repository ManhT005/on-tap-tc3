import type { ReviewStatus } from '../../data/schemas';

export function getDueReviewItems(items: readonly ReviewStatus[], now: Date): ReviewStatus[] {
  const timestamp = now.toISOString();
  return items.filter((item) => item.nextReviewAt <= timestamp);
}

export function sortReviewQueue(items: readonly ReviewStatus[]): ReviewStatus[] {
  return [...items].sort(
    (left, right) =>
      left.nextReviewAt.localeCompare(right.nextReviewAt) ||
      right.wrongCount - left.wrongCount ||
      left.box - right.box ||
      left.itemType.localeCompare(right.itemType) ||
      left.itemId.localeCompare(right.itemId),
  );
}
