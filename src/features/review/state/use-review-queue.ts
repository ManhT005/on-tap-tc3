import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReviewStatus } from '../../../data/schemas';
import { getReviewPrompt } from '../../../domain/review/review-content';
import { getDueReviewItems, sortReviewQueue } from '../../../domain/review/review-queue';
import type { ReviewConfidence } from '../../../domain/review/review-engine';
import type { ReviewCommand } from '../../../domain/review/review-command';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

export function useReviewQueue() {
  const { repository, storageRevision } = useProgressRepository();
  const [items, setItems] = useState<ReviewStatus[]>([]);
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradingKeys, setGradingKeys] = useState<Set<string>>(() => new Set());
  const locks = useRef(new Set<string>());
  const pendingEvents = useRef(new Map<string, ReviewCommand>());
  const sequence = useRef(0);
  const active = useRef(true);

  const refresh = useCallback(async () => {
    const request = ++sequence.current;
    try {
      const reviewItems = await repository.getReviewItems();
      if (active.current && request === sequence.current) {
        setItems(sortReviewQueue(reviewItems));
        setNow(new Date());
        setError(null);
      }
    } catch {
      if (active.current) setError('Không tải được danh sách ôn tập. Hãy thử lại.');
    } finally {
      if (active.current) setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    active.current = true;
    void Promise.resolve().then(refresh);
    const requestSequence = sequence;
    const onFocus = () => {
      void refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    const timer = window.setInterval(onFocus, 30_000);
    window.addEventListener('focus', onFocus);
    window.addEventListener('tc3-progress-changed', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      active.current = false;
      requestSequence.current++;
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('tc3-progress-changed', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh, storageRevision]);

  async function grade(item: ReviewStatus, confidence: ReviewConfidence): Promise<void> {
    const key = `${item.itemType}:${item.itemId}`;
    if (locks.current.has(key)) return;
    locks.current.add(key);
    setGradingKeys(new Set(locks.current));
    const event = pendingEvents.current.get(key) ?? {
      eventId: crypto.randomUUID(),
      itemId: item.itemId,
      itemType: item.itemType,
      correct: confidence >= 3,
      confidence,
      gradedAt: new Date().toISOString(),
    };
    pendingEvents.current.set(key, event);
    try {
      await repository.applyReview(event);
      pendingEvents.current.delete(key);
      await refresh();
    } catch (error) {
      setError('Không lưu được kết quả ôn tập. Hãy thử lại.');
      throw error;
    } finally {
      locks.current.delete(key);
      if (active.current) setGradingKeys(new Set(locks.current));
    }
  }

  const dueItems = getDueReviewItems(items, now).map((item) => ({
    item,
    content: getReviewPrompt(item),
  }));
  const orphanCount = items.filter((item) => getReviewPrompt(item) === null).length;
  const recentMistakes = [...items]
    .filter((item) => item.wrongCount > 0)
    .sort((a, b) => (b.lastWrongAt ?? '').localeCompare(a.lastWrongAt ?? ''))
    .slice(0, 5)
    .map((item) => ({ item, content: getReviewPrompt(item) }));
  return { dueItems, recentMistakes, orphanCount, loading, error, grade, gradingKeys, refresh };
}
