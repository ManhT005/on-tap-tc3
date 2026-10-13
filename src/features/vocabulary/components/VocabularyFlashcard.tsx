import type { VocabularyEntry } from '../../../domain/vocabulary/vocabulary.types';
import { KoreanSpeechControls } from '../../../components/learning/KoreanSpeechControls';

export function VocabularyFlashcard({
  entry,
  revealed,
}: {
  entry: VocabularyEntry;
  revealed: boolean;
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
        <KoreanSpeechControls key={entry.id} text={entry.korean} compact />
        {entry.partOfSpeech ? <p>{entry.partOfSpeech}</p> : null}
        {revealed ? (
          <div className="vocab-card__back">
            <p className="vocab-meaning">{entry.vietnamese}</p>
            {examples.length
              ? examples.map((example, index) => (
                  <div className="vocab-example" key={index}>
                    <p lang="ko">
                      {example.targetRange ? (
                        <>
                          {example.kr.slice(0, example.targetRange[0])}
                          <mark>{example.kr.slice(...example.targetRange)}</mark>
                          {example.kr.slice(example.targetRange[1])}
                        </>
                      ) : (
                        example.kr
                      )}
                    </p>
                    <p>{example.vn}</p>
                    <KoreanSpeechControls text={example.kr} label="Nghe câu ví dụ" />
                  </div>
                ))
              : null}
            {entry.collocations.length ? (
              <details className="vocab-related">
                <summary>Cụm liên quan</summary>
                <p lang="ko">{entry.collocations.join(' · ')}</p>
              </details>
            ) : null}
            {entry.reviewStatus === 'approved' && entry.memoryHint ? (
              <p>{entry.memoryHint}</p>
            ) : null}
          </div>
        ) : (
          <p className="muted-copy">Thử nói nghĩa tiếng Việt trước khi lật thẻ.</p>
        )}
      </article>
    </>
  );
}
