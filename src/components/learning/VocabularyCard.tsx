import type { VocabularyPack } from '../../data/schemas';
import { Flashcard, type RecallConfidence } from './Flashcard';

export type VocabularyCardProps = {
  item: VocabularyPack['items'][number];
  category: string;
  markedForReview: boolean;
  onMarkForReview: () => void;
  onConfidence: (confidence: RecallConfidence) => void;
};

export function VocabularyCard({
  item,
  category,
  markedForReview,
  onMarkForReview,
  onConfidence,
}: VocabularyCardProps) {
  return (
    <div className="vocabulary-card">
      <p className="vocabulary-card__category">{category}</p>
      <Flashcard
        front={item.kr}
        back={item.vn}
        example={item.note}
        markedForReview={markedForReview}
        onMarkForReview={onMarkForReview}
        onConfidence={onConfidence}
      />
    </div>
  );
}
