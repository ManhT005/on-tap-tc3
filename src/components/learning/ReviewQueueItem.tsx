import { useRef, useState } from 'react';
import type { ReviewStatus } from '../../data/schemas';
import type { ReviewPrompt } from '../../domain/review/review-content';
import type { ReviewConfidence } from '../../domain/review/review-engine';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export type ReviewQueueItemProps = {
  item: ReviewStatus;
  content: ReviewPrompt;
  onGrade: (confidence: ReviewConfidence) => void | Promise<void>;
  isSubmitting?: boolean;
};

export function ReviewQueueItem({
  item,
  content,
  onGrade,
  isSubmitting = false,
}: ReviewQueueItemProps) {
  const [revealed, setRevealed] = useState(false);
  const [confidence, setConfidence] = useState<ReviewConfidence | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const busy = saving || isSubmitting;

  async function save() {
    if (lock.current || busy || confidence === null) return;
    lock.current = true;
    setSaving(true);
    setError(null);
    try {
      await onGrade(confidence);
    } catch {
      setError('Kết quả chưa được xác nhận lưu. Vui lòng thử lại.');
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }

  return (
    <Card as="article" className="review-queue-item">
      <div className="review-queue-item__meta">
        <span>
          {item.itemType === 'question'
            ? 'Câu hỏi'
            : item.itemType === 'grammar'
              ? 'Ngữ pháp'
              : 'Từ vựng'}
        </span>
        <span>{item.wrongCount} lần sai</span>
      </div>
      <h2>{content.prompt}</h2>
      <Button
        variant="secondary"
        size="sm"
        aria-expanded={revealed}
        onClick={() => setRevealed(true)}
      >
        {revealed ? 'Đáp án đã hiện' : 'Hiện đáp án'}
      </Button>
      {revealed ? (
        <div className="review-queue-item__answer">
          <p>{content.answer}</p>
          {content.example ? <p>{content.example}</p> : null}
        </div>
      ) : null}
      <div className="review-queue-item__confidence" role="group" aria-label="Mức độ ghi nhớ">
        {([1, 2, 3, 4] as const).map((value) => (
          <button
            key={value}
            className={
              confidence === value ? 'lesson-filter lesson-filter--active' : 'lesson-filter'
            }
            type="button"
            aria-pressed={confidence === value}
            disabled={!revealed || busy}
            onClick={() => setConfidence(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <Button disabled={!revealed || confidence === null || busy} onClick={() => void save()}>
        {busy ? 'Đang lưu...' : 'Lưu kết quả ôn'}
      </Button>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </Card>
  );
}
