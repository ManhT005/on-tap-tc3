import type { VocabularyEntry } from '../../../domain/vocabulary/vocabulary.types';
import { Button } from '../../../components/ui/Button';

export function VocabularyFlashcard({
  entry,
  revealed,
  onReveal,
  disabled,
}: {
  entry: VocabularyEntry;
  revealed: boolean;
  onReveal: () => void;
  disabled: boolean;
}) {
  const examples =
    entry.reviewStatus === 'approved'
      ? (entry.examples?.filter((example) => example.reviewStatus === 'approved') ?? [])
      : [];
  return (
    <>
      <article className="vocab-card" aria-label="Thẻ từ vựng">
        <p className="eyebrow">{entry.category}</p>
        <h3 className="vocab-hangul" lang="ko">
          {entry.korean}
        </h3>
        {entry.partOfSpeech ? <p>{entry.partOfSpeech}</p> : null}
        {revealed ? (
          <div className="vocab-card__back">
            <p className="vocab-meaning">{entry.vietnamese}</p>
            {examples.length ? (
              examples.map((example, index) => (
                <div className="vocab-example" key={index}>
                  <p lang="ko">{example.kr}</p>
                  <p>{example.vn}</p>
                </div>
              ))
            ) : (
              <p className="muted-copy">Chưa có câu ví dụ được kiểm duyệt.</p>
            )}
            {entry.collocations.length ? (
              <p>
                Cụm liên quan: <span lang="ko">{entry.collocations.join(' · ')}</span>
              </p>
            ) : null}
            {entry.reviewStatus === 'approved' && entry.memoryHint ? (
              <p>{entry.memoryHint}</p>
            ) : null}
          </div>
        ) : (
          <p className="muted-copy">Thử nói nghĩa tiếng Việt trước khi lật thẻ.</p>
        )}
      </article>
      <Button disabled={disabled} onClick={onReveal} aria-expanded={revealed}>
        {revealed ? 'Ẩn nghĩa' : 'Hiện nghĩa'}
      </Button>
    </>
  );
}
