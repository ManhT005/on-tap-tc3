import { useEffect, useState } from 'react';
import { COURSE_STRUCTURE } from '../../../data/course';
import { QUIZ_BANK } from '../../../data/quiz-bank';
import { completePracticeSession } from '../../../domain/practice/complete-practice';
import { createPracticeSession } from '../../../domain/practice/practice-session';
import type { PracticeResult, PracticeSession } from '../../../domain/practice/practice.types';
import { QuizCard } from '../../../components/learning/QuizCard';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

type QuizFilter = 'all' | 'lesson' | 'mistakes';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function QuizPractice() {
  const { repository } = useProgressRepository();
  const [filter, setFilter] = useState<QuizFilter>('all');
  const [lessonId, setLessonId] = useState(1);
  const [mistakeIds, setMistakeIds] = useState<Set<string>>(() => new Set());
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    repository
      .getReviewItems()
      .then((items) => {
        if (active) {
          setMistakeIds(
            new Set(
              items.filter((item) => item.itemType === 'question').map((item) => item.itemId),
            ),
          );
        }
      })
      .catch(() => {
        if (active) setError('Không tải được danh sách câu sai.');
      });

    return () => {
      active = false;
    };
  }, [repository]);

  const availableQuestions = QUIZ_BANK.filter((question) => {
    if (filter === 'lesson') return question.lessonId === lessonId;
    if (filter === 'mistakes') return mistakeIds.has(String(question.id));
    return true;
  });

  function startSession() {
    if (!availableQuestions.length) {
      setError('Chưa có câu hỏi phù hợp với bộ lọc này.');
      return;
    }

    const selectedQuestions = availableQuestions.slice(0, 10);
    setSession(
      createPracticeSession({
        id: createId('quiz-session'),
        lessonId: filter === 'lesson' ? lessonId : undefined,
        mode: 'quiz',
        questionIds: selectedQuestions.map((question) => question.id),
        startedAt: new Date().toISOString(),
      }),
    );
    setAnswers({});
    setResult(null);
    setError(null);
  }

  async function submit() {
    if (!session || result || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const completed = await completePracticeSession(
        { ...session, answers },
        availableQuestions.map(({ id, correctIndex }) => ({ id, correctIndex })),
        repository,
        { resultId: `quiz-result-${session.id}`, completedAt: new Date().toISOString() },
      );
      setResult(completed);
    } catch {
      setError('Không lưu được kết quả bài quiz.');
    } finally {
      setSubmitting(false);
    }
  }

  const sessionQuestions = session
    ? session.questionIds
        .map((id) => availableQuestions.find((question) => String(question.id) === id))
        .filter((question) => question !== undefined)
    : [];
  const allAnswered =
    sessionQuestions.length > 0 &&
    sessionQuestions.every((question) => typeof answers[String(question.id)] === 'number');

  return (
    <section className="practice-mode">
      <div className="practice-controls">
        <label>
          Bộ câu hỏi
          <select
            value={filter}
            disabled={session !== null && result === null}
            onChange={(event) => {
              setFilter(event.target.value as QuizFilter);
              setSession(null);
              setResult(null);
            }}
          >
            <option value="all">Tất cả bài</option>
            <option value="lesson">Theo bài</option>
            <option value="mistakes">Câu sai</option>
          </select>
        </label>
        {filter === 'lesson' ? (
          <label>
            Bài học
            <select
              value={lessonId}
              disabled={session !== null && result === null}
              onChange={(event) => {
                setLessonId(Number(event.target.value));
                setSession(null);
                setResult(null);
              }}
            >
              {COURSE_STRUCTURE.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  Bài {String(lesson.id).padStart(2, '0')}: {lesson.koreanTitle}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <p>{availableQuestions.length} câu hỏi phù hợp</p>
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {!session ? (
        availableQuestions.length ? (
          <Button onClick={startSession}>Bắt đầu quiz</Button>
        ) : (
          <EmptyState
            title="Chưa có câu hỏi phù hợp"
            description="Chọn bộ câu hỏi khác hoặc bắt đầu học để tạo lịch sử sai."
          />
        )
      ) : result ? (
        <div className="practice-result" role="status">
          <h2>Đã lưu kết quả</h2>
          <p>
            Điểm: {result.score}% · Đúng {result.correct}/{result.total}
          </p>
          <p>{result.wrong} câu sai đã được đưa vào ôn tập.</p>
          <Button variant="secondary" onClick={() => setSession(null)}>
            Làm lượt khác
          </Button>
        </div>
      ) : (
        <div className="quiz-list">
          {sessionQuestions.map((question) => (
            <QuizCard
              key={question.id}
              question={question}
              selectedAnswer={answers[String(question.id)] as number | undefined}
              onSelect={(answer) =>
                setAnswers((current) => ({ ...current, [String(question.id)]: answer }))
              }
            />
          ))}
          <Button disabled={!allAnswered || submitting} onClick={() => void submit()}>
            {submitting ? 'Đang chấm điểm...' : 'Chấm điểm và lưu kết quả'}
          </Button>
        </div>
      )}
    </section>
  );
}
