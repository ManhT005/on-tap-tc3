import type { LessonQuiz } from '../../domain/learning/learning.types';
import { Card } from '../ui/Card';

export type QuizCardProps = {
  question: LessonQuiz;
  selectedAnswer?: number;
  submitted?: boolean;
  onSelect: (answerIndex: number) => void;
};

export function QuizCard({ question, selectedAnswer, submitted = false, onSelect }: QuizCardProps) {
  return (
    <Card as="article" className="quiz-card">
      <h3>{question.question}</h3>
      <div role="group" aria-label={`Đáp án cho câu ${question.id}`} className="quiz-card__options">
        {question.options.map((option, index) => {
          const isCorrect = submitted && index === question.correctIndex;
          const isWrongSelection = submitted && index === selectedAnswer && !isCorrect;

          return (
            <button
              key={option}
              type="button"
              className={[
                'quiz-option',
                selectedAnswer === index && 'quiz-option--selected',
                isCorrect && 'quiz-option--correct',
                isWrongSelection && 'quiz-option--wrong',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={selectedAnswer === index}
              disabled={submitted}
              onClick={() => onSelect(index)}
            >
              <span className="quiz-option__marker">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {submitted ? (
        <div className="quiz-card__feedback" role="status">
          <p>{selectedAnswer === question.correctIndex ? 'Chính xác.' : 'Chưa chính xác.'}</p>
          <p>{question.explanation}</p>
          {question.whyWrong ? <p>{question.whyWrong}</p> : null}
        </div>
      ) : null}
    </Card>
  );
}
