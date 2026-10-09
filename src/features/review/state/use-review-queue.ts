import { useEffect, useState } from 'react';
import type { ReviewStatus } from '../../../data/schemas';
import { getReviewPrompt } from '../../../domain/review/review-content';
import { getDueReviewItems, sortReviewQueue } from '../../../domain/review/review-queue';
import { gradeReview, type ReviewConfidence } from '../../../domain/review/review-engine';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

export function useReviewQueue() {
  const { repository } = useProgressRepository();
  const [items, setItems] = useState<ReviewStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // BUG-P2-012: Track which item is currently being graded to prevent double-submit.
  const [gradingItemId, setGradingItemId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    repository
      .getReviewItems()
      .then((reviewItems) => {
        if (active) setItems(sortReviewQueue(reviewItems));
      })
      .catch(() => {
        if (active) setError('Không tải được danh sách ôn tập.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repository]);

  const dueItems = getDueReviewItems(items, new Date());

  // BUG-P2-011: Sort recentMistakes by lastWrongAt DESC so the list reflects actual
  // last-wrong time rather than nextReviewAt order. Items without lastWrongAt (legacy data)
  // fall to the end since they predate tracking and cannot be confirmed as recent.
  const recentMistakes = [...items]
    .filter((item) => item.wrongCount > 0)
    .sort((a, b) => {
      const aTime = a.lastWrongAt ?? '';
      const bTime = b.lastWrongAt ?? '';
      return bTime.localeCompare(aTime); // DESC: most recent first
    })
    .slice(0, 5);

  // BUG-P2-012: grade() returns a Promise and prevents concurrent submissions for the
  // same item. The caller (ReviewPage / ReviewQueueItem) should disable buttons while
  // grade is in flight.
  async function grade(item: ReviewStatus, confidence: ReviewConfidence): Promise<void> {
    const itemKey = `${item.itemType}:${item.itemId}`;
    if (gradingItemId === itemKey) return; // Already in progress for this item

    setGradingItemId(itemKey);
    try {
      const updated = gradeReview(item, confidence >= 3, confidence, new Date());
      await repository.saveReviewItem(updated);
      setItems((current) =>
        sortReviewQueue(current.map((candidate) => (candidate === item ? updated : candidate))),
      );
    } catch {
      setError('Không lưu được kết quả ôn tập.');
    } finally {
      setGradingItemId(null);
    }
  }

  const dueItemsWithContent = dueItems.map((item) => ({ item, content: getReviewPrompt(item) }));
  const orphanCount = dueItemsWithContent.filter((entry) => entry.content === null).length;

  return {
    dueItems: dueItemsWithContent,
    recentMistakes: recentMistakes.map((item) => ({ item, content: getReviewPrompt(item) })),
    orphanCount,
    loading,
    error,
    grade,
    gradingItemId,
  };
}
