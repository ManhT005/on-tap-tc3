import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export type RecallConfidence = 1 | 2 | 3 | 4;

export type FlashcardProps = {
  front: ReactNode;
  back: ReactNode;
  example?: ReactNode;
  markedForReview?: boolean;
  onMarkForReview?: () => void;
  onConfidence?: (confidence: RecallConfidence) => void;
};

const confidenceLabels: Record<RecallConfidence, string> = {
  1: 'Không nhớ',
  2: 'Khó nhớ',
  3: 'Nhớ được',
  4: 'Rất chắc',
};

export function Flashcard({
  front,
  back,
  example,
  markedForReview = false,
  onMarkForReview,
  onConfidence,
}: FlashcardProps) {
  const [revealed, setRevealed] = useState(false);
  const backId = useId();

  return (
    <Card as="article" className="flashcard">
      <div className="flashcard__front">
        <h3>{front}</h3>
      </div>
      <Button
        variant="secondary"
        size="sm"
        aria-expanded={revealed}
        aria-controls={backId}
        onClick={() => setRevealed((current) => !current)}
      >
        {revealed ? 'Ẩn nghĩa' : 'Hiện nghĩa'}
      </Button>
      {revealed ? (
        <div className="flashcard__back" id={backId}>
          <p>{back}</p>
          {example ? <p className="flashcard__example">{example}</p> : null}
          {onConfidence ? (
            <div className="flashcard__confidence" role="group" aria-label="Mức độ ghi nhớ">
              {([1, 2, 3, 4] as const).map((confidence) => (
                <Button
                  key={confidence}
                  variant="ghost"
                  size="sm"
                  onClick={() => onConfidence(confidence)}
                >
                  {confidence} · {confidenceLabels[confidence]}
                </Button>
              ))}
            </div>
          ) : null}
          {onMarkForReview ? (
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={markedForReview}
              onClick={onMarkForReview}
            >
              {markedForReview ? 'Đã thêm vào danh sách ôn' : 'Đánh dấu cần ôn'}
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
