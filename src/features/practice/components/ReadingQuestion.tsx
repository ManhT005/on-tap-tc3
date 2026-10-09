import type { LegacyReadingPassageSchema } from '../../../data/schemas/legacy.schema';

type ReadingQuestionData = (typeof LegacyReadingPassageSchema)['_output']['questions'][number];

export type ReadingQuestionProps = {
  question: ReadingQuestionData;
  selectedAnswer?: number;
  submitted: boolean;
  onSelect: (answer: number) => void;
};

export function ReadingQuestion({
  question,
  selectedAnswer,
  submitted,
  onSelect,
}: ReadingQuestionProps) {
  return (
    <article className="reading-question">
      <h3>{question.question}</h3>
      <div className="quiz-card__options" role="group" aria-label={`Đáp án cho câu ${question.id}`}>
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            className={[
              'quiz-option',
              selectedAnswer === index && 'quiz-option--selected',
              submitted && index === question.correctIndex && 'quiz-option--correct',
              submitted &&
                selectedAnswer === index &&
                index !== question.correctIndex &&
                'quiz-option--wrong',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={selectedAnswer === index}
            disabled={submitted}
            onClick={() => onSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
      {submitted ? <p role="status">근거: {question.evidence ?? '정답을 확인하세요.'}</p> : null}
    </article>
  );
}
