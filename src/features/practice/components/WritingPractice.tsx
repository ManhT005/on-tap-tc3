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
  const [response, setResponse] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prompt = WRITING_BANK.find((item) => item.lessonId === lessonId);

  const missingKeywords = prompt
    ? prompt.requiredKeywords.filter((keyword) => !response.includes(keyword))
    : [];

  async function saveAssessment(metRequirements: boolean) {
    if (!prompt || saved || submitting) return;
    if (!response.trim()) {
      setError('Vui lòng viết câu trả lời trước khi tự đánh giá.');
      return;
    }

    setSubmitting(true);
    setError(null);
    const startedAt = new Date().toISOString();
    const sessionId = createId('writing-session');
    const session = createPracticeSession({
      id: sessionId,
      lessonId,
      mode: 'writing',
      questionIds: [prompt.id],
      startedAt,
    });
    const result = scorePractice(
      { ...session, answers: { [prompt.id]: metRequirements ? 1 : 0 } },
      [{ id: prompt.id, correctIndex: 1 }],
      { resultId: `writing-result-${sessionId}`, completedAt: new Date().toISOString() },
    );

    try {
      await repository.savePracticeResult(result);
      setSelfAssessment(metRequirements);
      setSaved(true);
    } catch {
      setError('Không lưu được phần tự đánh giá.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="practice-mode writing-practice">
      <label>
        Bài học
        <select
          value={lessonId}
          onChange={(event) => {
            setLessonId(Number(event.target.value));
            setResponse('');
            setShowModelAnswer(false);
            setSelfAssessment(null);
            setSaved(false);
            setError(null);
          }}
        >
          {COURSE_STRUCTURE.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              Bài {String(lesson.id).padStart(2, '0')}: {lesson.koreanTitle}
            </option>
          ))}
        </select>
      </label>

      {!prompt ? (
        <EmptyState
          title="Chưa có đề bài viết"
          description="Bài viết sẽ xuất hiện khi có nội dung cho bài học đã chọn."
        />
      ) : (
        <>
          <article className="writing-prompt card">
            <p className="eyebrow">{prompt.title}</p>
            <p>{prompt.prompt}</p>
            <h3>Từ khóa cần có</h3>
            <ul>
              {prompt.requiredKeywords.map((keyword) => {
                const found = response.includes(keyword);
                return (
                  <li key={keyword}>
                    {keyword} {response.trim() ? (found ? '✓' : '— chưa có') : ''}
                  </li>
                );
              })}
            </ul>
            {response.trim() && missingKeywords.length > 0 ? (
              <p className="muted-copy" role="note">
                💡 Lưu ý: Đoạn viết có thể còn thiếu từ khóa: {missingKeywords.join(', ')}.
              </p>
            ) : null}
            <label className="writing-response">
              Câu trả lời của bạn
              <textarea
                rows={5}
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                disabled={saved || submitting}
                placeholder="Nhập câu trả lời bằng tiếng Hàn..."
                aria-label="Câu trả lời của bạn"
              />
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
                disabled={!showModelAnswer || saved || submitting || !response.trim()}
                onClick={() => void saveAssessment(true)}
              >
                {submitting ? 'Đang lưu...' : 'Đạt yêu cầu'}
              </Button>
              <Button
                variant="ghost"
                disabled={!showModelAnswer || saved || submitting || !response.trim()}
                onClick={() => void saveAssessment(false)}
              >
                {submitting ? 'Đang lưu...' : 'Cần luyện thêm'}
              </Button>
            </div>
            {!response.trim() && showModelAnswer && !saved ? (
              <p className="muted-copy">Vui lòng viết câu trả lời trước khi tự đánh giá.</p>
            ) : null}
            {selfAssessment !== null ? (
              <p role="status">Đã lưu: {selfAssessment ? 'Đạt yêu cầu' : 'Cần luyện thêm'}.</p>
            ) : null}
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
