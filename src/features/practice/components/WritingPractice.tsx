import { useState } from 'react';
import { COURSE_STRUCTURE } from '../../../data/course';
import { WRITING_BANK } from '../../../data/writing-bank';
import { createPracticeSession } from '../../../domain/practice/practice-session';
import { scorePractice } from '../../../domain/practice/score-practice';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function WritingPractice() {
  const { repository } = useProgressRepository();
  const [lessonId, setLessonId] = useState(1);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prompt = WRITING_BANK.find((item) => item.lessonId === lessonId);

  async function saveAssessment(metRequirements: boolean) {
    if (!prompt || saved) return;

    const startedAt = new Date().toISOString();
    const session = createPracticeSession({
      id: createId('writing-session'),
      lessonId,
      mode: 'writing',
      questionIds: [prompt.id],
      startedAt,
    });
    const result = scorePractice(
      { ...session, answers: { [prompt.id]: metRequirements ? 1 : 0 } },
      [{ id: prompt.id, correctIndex: 1 }],
      { resultId: createId('writing-result'), completedAt: new Date().toISOString() },
    );

    try {
      await repository.savePracticeResult(result);
      setSelfAssessment(metRequirements);
      setSaved(true);
    } catch {
      setError('Không lưu được phần tự đánh giá.');
    }
  }

  if (!prompt) {
    return (
      <EmptyState
        title="Chưa có đề bài viết"
        description="Bài viết sẽ xuất hiện khi có nội dung cho bài học đã chọn."
      />
    );
  }

  return (
    <section className="practice-mode writing-practice">
      <label>
        Bài học
        <select
          value={lessonId}
          onChange={(event) => {
            setLessonId(Number(event.target.value));
            setShowModelAnswer(false);
            setSelfAssessment(null);
            setSaved(false);
          }}
        >
          {COURSE_STRUCTURE.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              Bài {String(lesson.id).padStart(2, '0')}: {lesson.koreanTitle}
            </option>
          ))}
        </select>
      </label>

      <article className="writing-prompt card">
        <p className="eyebrow">{prompt.title}</p>
        <p>{prompt.prompt}</p>
        <h3>Từ khóa cần có</h3>
        <ul>
          {prompt.requiredKeywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
        <label className="writing-response">
          Câu trả lời của bạn
          <textarea rows={5} disabled={saved} aria-label="Câu trả lời của bạn" />
        </label>
        <p>{prompt.explanation}</p>
        <Button
          variant="secondary"
          size="sm"
          aria-expanded={showModelAnswer}
          onClick={() => setShowModelAnswer((visible) => !visible)}
        >
          {showModelAnswer ? 'Ẩn bài mẫu' : 'Hiện bài mẫu'}
        </Button>
        {showModelAnswer ? (
          <p className="writing-model-answer" lang="ko">
            {prompt.modelAnswer}
          </p>
        ) : null}
      </article>

      <div className="writing-self-check">
        <h3>Tự đánh giá</h3>
        <p>Bạn đã dùng đủ từ khóa và hoàn thành đúng yêu cầu chưa?</p>
        <div className="writing-self-check__actions">
          <Button
            variant="secondary"
            disabled={!showModelAnswer || saved}
            onClick={() => void saveAssessment(true)}
          >
            Đạt yêu cầu
          </Button>
          <Button
            variant="ghost"
            disabled={!showModelAnswer || saved}
            onClick={() => void saveAssessment(false)}
          >
            Cần luyện thêm
          </Button>
        </div>
        {selfAssessment !== null ? (
          <p role="status">Đã lưu: {selfAssessment ? 'Đạt yêu cầu' : 'Cần luyện thêm'}.</p>
        ) : null}
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
