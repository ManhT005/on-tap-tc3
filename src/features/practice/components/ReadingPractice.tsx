import { useState } from 'react';
import { COURSE_STRUCTURE } from '../../../data/course';
import { getLessonReading } from '../../../domain/learning/lesson.service';
import { completePracticeSession } from '../../../domain/practice/complete-practice';
import { createPracticeSession } from '../../../domain/practice/practice-session';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ReadingQuestion } from './ReadingQuestion';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ReadingPractice() {
  const { repository } = useProgressRepository();
  const [lessonId, setLessonId] = useState(1);
  const [passageIndex, setPassageIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const readingResult = getLessonReading(lessonId);
  const passage = readingResult.ok ? readingResult.data[passageIndex] : undefined;

  async function submit() {
    if (!passage || submitted || submitting) return;

    setSubmitting(true);
    setError(null);
    const session = createPracticeSession({
      id: createId('reading-session'),
      lessonId,
      mode: 'reading',
      questionIds: passage.questions.map((question) => question.id),
      startedAt: new Date().toISOString(),
    });

    try {
      const completed = await completePracticeSession(
        { ...session, answers },
        passage.questions.map(({ id, correctIndex }) => ({ id, correctIndex })),
        repository,
        { resultId: `reading-result-${session.id}`, completedAt: new Date().toISOString() },
      );
      setResult({ score: completed.score, correct: completed.correct, total: completed.total });
      setSubmitted(true);
    } catch {
      setError('Không lưu được kết quả đọc hiểu.');
    } finally {
      setSubmitting(false);
    }
  }

  function resetPassage(nextPassageIndex = passageIndex) {
    setPassageIndex(nextPassageIndex);
    setAnswers({});
    setSubmitted(false);
    setSubmitting(false);
    setResult(null);
    setShowTranslation(false);
    setError(null);
  }

  return (
    <section className="practice-mode">
      <div className="practice-controls">
        <label>
          Bài học
          <select
            value={lessonId}
            onChange={(event) => {
              setLessonId(Number(event.target.value));
              resetPassage(0);
            }}
          >
            {COURSE_STRUCTURE.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                Bài {String(lesson.id).padStart(2, '0')}: {lesson.koreanTitle}
              </option>
            ))}
          </select>
        </label>
        {readingResult.ok && readingResult.data.length > 1 ? (
          <label>
            Bài đọc
            <select
              value={passageIndex}
              onChange={(event) => resetPassage(Number(event.target.value))}
            >
              {readingResult.data.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {!readingResult.ok || !passage ? (
        <EmptyState
          title="Chưa có bài đọc"
          description="Bài đọc sẽ xuất hiện khi nội dung của bài học được hoàn thiện."
        />
      ) : (
        <>
          <article className="reading-passage card">
            <p className="eyebrow">{passage.type}</p>
            <h2>{passage.title}</h2>
            <p lang="ko" className="reading-passage__text">
              {passage.koreanText}
            </p>
            {showTranslation ? (
              <p className="reading-passage__translation">{passage.vietnameseTranslation}</p>
            ) : null}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowTranslation((visible) => !visible)}
            >
              {showTranslation ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
            </Button>
          </article>

          <div className="reading-questions">
            {passage.questions.map((question) => (
              <ReadingQuestion
                key={question.id}
                question={question}
                selectedAnswer={answers[question.id]}
                submitted={submitted}
                onSelect={(answer) =>
                  setAnswers((current) => ({ ...current, [question.id]: answer }))
                }
              />
            ))}
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          {result ? (
            <p role="status">
              Đúng {result.correct}/{result.total} · {result.score}%
            </p>
          ) : null}
          {submitted ? (
            <Button variant="secondary" onClick={() => resetPassage()}>
              Luyện lại bài đọc
            </Button>
          ) : (
            <Button
              disabled={
                submitting ||
                !passage.questions.length ||
                !passage.questions.every((question) => answers[question.id] !== undefined)
              }
              onClick={() => void submit()}
            >
              {submitting ? 'Đang chấm điểm...' : 'Chấm điểm bài đọc'}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
