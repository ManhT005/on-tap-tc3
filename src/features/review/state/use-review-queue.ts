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
  const recentMistakes = items.filter((item) => item.wrongCount > 0).slice(0, 5);

  async function grade(item: ReviewStatus, confidence: ReviewConfidence) {
    try {
      const updated = gradeReview(item, confidence >= 3, confidence, new Date());
      await repository.saveReviewItem(updated);
      setItems((current) =>
        sortReviewQueue(current.map((candidate) => (candidate === item ? updated : candidate))),
      );
    } catch {
      setError('Không lưu được kết quả ôn tập.');
    }
  }

  return {
    dueItems: dueItems.map((item) => ({ item, content: getReviewPrompt(item) })),
    recentMistakes: recentMistakes.map((item) => ({ item, content: getReviewPrompt(item) })),
    loading,
    error,
    grade,
  };
}
