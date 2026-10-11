import { useRef, useState } from 'react';
import { LISTENING_BANK } from '../../../data/listening-bank';
import { COURSE_STRUCTURE } from '../../../data/course';
import type { ListeningPassage } from '../../../data/schemas/listening.schema';
import type { PracticeResult } from '../../../domain/practice/practice.types';
import { completePracticeSession } from '../../../domain/practice/complete-practice';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { ListeningPlayer } from '../../../components/learning/ListeningPlayer';
import { Button } from '../../../components/ui/Button';
import { ReadingQuestion } from './ReadingQuestion';

function ListeningSession({ passage }: { passage: ListeningPassage }) {
  const { repository } = useProgressRepository();
  const [session] = useState(() => ({
    id: crypto.randomUUID(),
    mode: 'listening' as const,
    lessonId: passage.lessonId,
    questionIds: passage.questions.map((question) => question.id),
    startedAt: new Date().toISOString(),
  }));
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reveal, setReveal] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  async function submit() {
    if (lock.current || result) return;
    lock.current = true;
    setSaving(true);
    setError(null);
    try {
      setResult(
        await completePracticeSession({ ...session, answers }, passage.questions, repository, {
          resultId: `listen-result-${session.id}`,
          completedAt: new Date().toISOString(),
        }),
      );
      setReveal(true);
    } catch {
      setError('Kết quả nghe chưa được lưu. Hãy thử lại.');
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  return (
    <article className="practice-mode">
      <h2>{passage.title}</h2>
      <ListeningPlayer key={passage.id} passage={passage} />
      <Button
        variant="secondary"
        aria-expanded={reveal}
        onClick={() => setReveal((value) => !value)}
      >
        {reveal ? 'Ẩn lời thoại' : 'Hiện lời thoại & bản dịch'}
      </Button>
      {reveal ? (
        <div className="card">
          <p className="preserve-lines" lang="ko">
            {passage.transcript}
          </p>
          <p>{passage.translation}</p>
        </div>
      ) : null}
      {passage.questions.map((question) => (
        <ReadingQuestion
          key={question.id}
          question={question}
          selectedAnswer={answers[question.id]}
          submitted={result !== null}
          disabled={saving}
          onSelect={(answer) => setAnswers((current) => ({ ...current, [question.id]: answer }))}
        />
      ))}
      <Button
        disabled={
          saving ||
          result !== null ||
          !passage.questions.every((question) => answers[question.id] !== undefined)
        }
        onClick={() => void submit()}
      >
        {saving ? 'Đang lưu...' : 'Chấm điểm bài nghe'}
      </Button>
      {result ? (
        <p role="status">
          Đã lưu kết quả nghe: {result.correct}/{result.total} · {result.score}%
        </p>
      ) : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}

export function ListeningPractice() {
  const [lessonId, setLessonId] = useState(1);
  const [passageId, setPassageId] = useState('listen-1-1');
  const passages = LISTENING_BANK.filter((passage) => passage.lessonId === lessonId);
  const passage = passages.find((candidate) => candidate.id === passageId) ?? passages[0]!;
  return (
    <section>
      <div className="practice-controls">
        <label>
          Bài nghe theo bài
          <select
            value={lessonId}
            onChange={(event) => {
              const id = Number(event.target.value);
              setLessonId(id);
              setPassageId(`listen-${id}-1`);
            }}
          >
            {COURSE_STRUCTURE.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                Bài {lesson.id}: {lesson.koreanTitle}
              </option>
            ))}
          </select>
        </label>
        <label>
          Đề nghe
          <select value={passage.id} onChange={(event) => setPassageId(event.target.value)}>
            {passages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ListeningSession key={passage.id} passage={passage} />
    </section>
  );
}
