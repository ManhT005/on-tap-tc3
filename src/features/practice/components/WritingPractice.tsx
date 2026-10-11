import { useRef, useState } from 'react';
import { COURSE_STRUCTURE } from '../../../data/course';
import { getLessonWriting } from '../../../domain/learning/lesson.service';
import { createPracticeSession } from '../../../domain/practice/practice-session';
import { scorePractice } from '../../../domain/practice/score-practice';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useWritingDraft } from '../state/use-writing-draft';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function WritingPractice() {
  const { repository } = useProgressRepository();
  const [lessonId, setLessonId] = useState(1);
  // BUG-P2-003: Track selected prompt by index so users can access all prompts per lesson.
  const [promptIndex, setPromptIndex] = useState(0);
  const submitLock = useRef(false);
  const attempt = useRef({ id: createId('writing-session'), startedAt: new Date().toISOString() });
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const writingResult = getLessonWriting(lessonId);
  const prompts = writingResult.ok && writingResult.data.length > 0 ? writingResult.data : [];
  const prompt = prompts[promptIndex] ?? null;
  const draft = useWritingDraft(lessonId, prompt?.id ?? 'unavailable');
  const response = draft.response;

  const missingKeywords = prompt
    ? prompt.requiredKeywords.filter((keyword) => !response.includes(keyword))
    : [];

  async function handleLessonChange(nextLessonId: number) {
    try {
      await draft.flushDraft();
    } catch {
      return;
    }
    setLessonId(nextLessonId);
    setPromptIndex(0);
    attempt.current = { id: createId('writing-session'), startedAt: new Date().toISOString() };
    setShowModelAnswer(false);
    setSelfAssessment(null);
    setSaved(false);
    setError(null);
  }

  async function handlePromptChange(nextIndex: number) {
    try {
      await draft.flushDraft();
    } catch {
      return;
    }
    setPromptIndex(nextIndex);
    // The previous draft has been flushed before changing the prompt.
    attempt.current = { id: createId('writing-session'), startedAt: new Date().toISOString() };
    setShowModelAnswer(false);
    setSelfAssessment(null);
    setSaved(false);
    setError(null);
  }

  async function saveAssessment(metRequirements: boolean) {
    if (!prompt || saved || submitLock.current) return;
    if (!response.trim()) {
      setError('Vui lòng viết câu trả lời trước khi tự đánh giá.');
      return;
    }

    setSubmitting(true);
    submitLock.current = true;
    setError(null);
    const { startedAt, id: sessionId } = attempt.current;
    const session = createPracticeSession({
      id: sessionId,
      lessonId,
      mode: 'writing',
      questionIds: [prompt.id],
      startedAt,
    });
    // BUG-P2-007: Mark as SELF_ASSESSED so objective accuracy excludes this result.
    const result = scorePractice(
      { ...session, answers: { [prompt.id]: metRequirements ? 1 : 0 } },
      [
        {
          id: prompt.id,
          correctIndex: 1,
          question: prompt.prompt,
          options: ['Cần luyện thêm', 'Đạt yêu cầu'],
          explanation: prompt.explanation,
        },
      ],
      {
        resultId: `writing-result-${sessionId}`,
        completedAt: new Date().toISOString(),
        assessmentType: 'SELF_ASSESSED',
        responses: { [prompt.id]: response },
      },
    );

    try {
      await draft.flushDraft();
      const committed = await repository.commitPracticeCompletion({
        sessionId,
        result,
        reviewCommands: [],
      });
      setSelfAssessment(committed.correct === 1);
      setSaved(true);
    } catch {
      setError('Không lưu được phần tự đánh giá.');
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <section className="practice-mode writing-practice">
      <div className="practice-controls">
        <label>
          Bài học
          <select
            value={lessonId}
            disabled={submitting || draft.status === 'saving'}
            onChange={(event) => void handleLessonChange(Number(event.target.value))}
          >
            {COURSE_STRUCTURE.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                Bài {String(lesson.id).padStart(2, '0')}: {lesson.koreanTitle}
              </option>
            ))}
          </select>
        </label>

        {/* BUG-P2-003: Show prompt selector when lesson has multiple writing prompts */}
        {prompts.length > 1 ? (
          <label>
            Đề bài
            <select
              aria-label="Đề viết"
              value={promptIndex}
              disabled={submitting || draft.status === 'saving'}
              onChange={(event) => void handlePromptChange(Number(event.target.value))}
            >
              {prompts.map((p, index) => (
                <option key={p.id} value={index}>
                  {index + 1}. {p.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

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
              {/* BUG-P2-008: Clearly inform user that draft text is not saved on prompt/lesson change */}
              <span className="muted-copy" aria-live="polite">
                {' '}
                {draft.loading
                  ? 'Đang tải bản nháp...'
                  : draft.status === 'saved'
                    ? 'Đã lưu bản nháp trên trình duyệt'
                    : draft.status === 'error'
                      ? 'Chưa lưu bản nháp'
                      : 'Đang lưu bản nháp...'}
              </span>
              <textarea
                rows={5}
                value={response}
                onChange={(event) => draft.changeResponse(event.target.value)}
                disabled={saved || submitting || draft.loading || draft.loadFailed}
                placeholder="Nhập câu trả lời bằng tiếng Hàn..."
                aria-label="Câu trả lời của bạn"
              />
            </label>
            <Button
              variant="secondary"
              disabled={draft.loading || submitting}
              onClick={() =>
                draft.loadFailed
                  ? draft.retryDraft()
                  : void draft.flushDraft().catch(() => undefined)
              }
            >
              {draft.loadFailed ? 'Thử tải lại bản nháp' : 'Lưu bản nháp'}
            </Button>
            {draft.error ? (
              <p className="form-error" role="alert">
                {draft.error}
              </p>
            ) : null}
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
            {saved ? (
              <Button
                variant="secondary"
                onClick={() => {
                  attempt.current = {
                    id: createId('writing-session'),
                    startedAt: new Date().toISOString(),
                  };
                  setSaved(false);
                  setSelfAssessment(null);
                  setShowModelAnswer(false);
                }}
              >
                Viết lại đề này
              </Button>
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
