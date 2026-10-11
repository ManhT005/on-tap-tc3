import { useState } from 'react';
import { useExamSession } from '../state/use-exam-session';
import { examBreakdown } from '../../../domain/exam/exam-engine';
import { ListeningPlayer } from '../../../components/learning/ListeningPlayer';
import { Button } from '../../../components/ui/Button';

export function ExamPractice() {
  const { attempt, loading, busy, error, now, load, start, mutate, finish } = useExamSession();
  const [timed, setTimed] = useState(true);
  const [withListening, setWithListening] = useState(false);
  const [index, setIndex] = useState(0);
  const active = attempt?.status === 'IN_PROGRESS';
  const completed = attempt?.status === 'SUBMITTED' || attempt?.status === 'EXPIRED';
  const question = attempt?.questions[index] ?? attempt?.questions[0];
  const sectionResults = attempt ? examBreakdown(attempt) : [];
  const correct = sectionResults.reduce((total, row) => total + row.correct, 0);
  const lessonResults = attempt
    ? [...new Set(attempt.questions.map((item) => item.lessonId))]
        .sort((a, b) => a - b)
        .map((lessonId) => {
          const items = attempt.questions.filter((item) => item.lessonId === lessonId);
          return {
            lessonId,
            total: items.length,
            correct: items.filter((item) => attempt.answers[item.id] === item.correctIndex).length,
          };
        })
    : [];
  const remaining = attempt?.deadlineAt
    ? Math.max(0, Math.ceil((Date.parse(attempt.deadlineAt) - now) / 1000))
    : null;
  return (
    <section className="exam-practice">
      <h2>Đề luyện tập TC3</h2>
      <p>
        Đề gồm 30 câu, chấm khách quan. Chế độ có giờ: 30 phút; hết giờ tự nộp đáp án đã lưu. Đây là
        đề luyện tập theo học liệu TC3, chưa được xác nhận mô phỏng TOPIK chuẩn.
      </p>
      {loading ? <p role="status">Đang tải đề đã lưu...</p> : null}
      {error ? (
        <div role="alert">
          <p>{error}</p>
          <Button variant="secondary" disabled={busy} onClick={() => void load()}>
            Thử tải lại đề
          </Button>
        </div>
      ) : null}
      {!active ? (
        <div className="practice-controls">
          <label>
            Chế độ đề
            <select
              value={timed ? 'timed' : 'practice'}
              disabled={busy}
              onChange={(event) => setTimed(event.target.value === 'timed')}
            >
              <option value="timed">Có giờ · 30 phút</option>
              <option value="practice">Luyện tập · không giới hạn giờ</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={withListening}
              disabled={busy}
              onChange={(event) => setWithListening(event.target.checked)}
            />{' '}
            Thêm 5 câu Listening (cần giọng Hàn trên thiết bị)
          </label>
          <Button
            disabled={busy || loading || !!error}
            onClick={() => {
              setIndex(0);
              void start(timed, withListening);
            }}
          >
            Bắt đầu đề mới
          </Button>
        </div>
      ) : null}
      {active && attempt && question ? (
        <>
          <div className="exam-status card">
            <p>
              Đã trả lời {Object.keys(attempt.answers).length}/{attempt.questions.length} · Đã lưu
              trên trình duyệt
            </p>
            <p role="timer" aria-live="off">
              {remaining === null
                ? 'Không giới hạn giờ'
                : `Còn lại ${Math.floor(remaining / 60)
                    .toString()
                    .padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`}
            </p>
            <p>
              Đề và thời điểm hết giờ được giữ khi reload. Hãy đợi thao tác lưu xong trước khi đóng
              trang.
            </p>
          </div>
          <nav className="exam-navigator" aria-label="Điều hướng câu hỏi">
            {attempt.questions.map((item, i) => (
              <Button
                key={item.id}
                variant={i === index ? 'primary' : 'secondary'}
                aria-current={i === index ? 'step' : undefined}
                aria-label={`Câu ${i + 1}${attempt.answers[item.id] !== undefined ? ', đã trả lời' : ''}${attempt.flaggedIds.includes(item.id) ? ', xem lại' : ''}`}
                onClick={() => setIndex(i)}
              >
                {i + 1}
                {attempt.flaggedIds.includes(item.id) ? '*' : ''}
              </Button>
            ))}
          </nav>
          <article className="card exam-question">
            <p>
              Câu {index + 1} · {question.section} · Bài {question.lessonId}
            </p>
            {question.context ? (
              <p className="preserve-lines" lang="ko">
                {question.context}
              </p>
            ) : null}
            {question.listening ? (
              <ListeningPlayer key={question.id} passage={question.listening} />
            ) : null}
            <h3>{question.question}</h3>
            <div role="group" aria-label={`Đáp án đề thi câu ${index + 1}`}>
              {question.options.map((option, answer) => (
                <Button
                  key={option}
                  variant={attempt.answers[question.id] === answer ? 'primary' : 'secondary'}
                  aria-pressed={attempt.answers[question.id] === answer}
                  disabled={busy || remaining === 0}
                  onClick={() =>
                    void mutate({
                      attemptId: attempt.id,
                      kind: 'answer',
                      questionId: question.id,
                      answer,
                    })
                  }
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              aria-pressed={attempt.flaggedIds.includes(question.id)}
              disabled={busy || remaining === 0}
              onClick={() =>
                void mutate({ attemptId: attempt.id, kind: 'flag', questionId: question.id })
              }
            >
              Đánh dấu xem lại
            </Button>
          </article>
          <div className="practice-controls">
            <Button
              disabled={busy}
              onClick={() => {
                if (
                  remaining === 0 ||
                  window.confirm(
                    `Bạn đã trả lời ${Object.keys(attempt.answers).length}/${attempt.questions.length} câu. Nộp đề này?`,
                  )
                )
                  void finish();
              }}
            >
              Nộp đề và lưu kết quả
            </Button>
            <Button
              variant="danger"
              disabled={busy}
              onClick={() => {
                if (window.confirm('Dừng đề này? Đề dừng sẽ không được chấm điểm.'))
                  void mutate({ attemptId: attempt.id, kind: 'abandon' });
              }}
            >
              Dừng đề đang làm
            </Button>
          </div>
        </>
      ) : null}
      {completed && attempt ? (
        <section aria-label="Kết quả đề thi" className="review-section">
          <h3>
            {attempt.status === 'EXPIRED'
              ? 'Hết giờ · đã lưu kết quả'
              : 'Đề đã nộp · đã lưu kết quả'}
          </h3>
          <p>
            Điểm: {Math.round((correct / attempt.questions.length) * 100)}% · Đúng {correct}/
            {attempt.questions.length} · Sai hoặc chưa trả lời: {attempt.questions.length - correct}
          </p>
          <table>
            <caption>Kết quả theo kỹ năng</caption>
            <thead>
              <tr>
                <th>Kỹ năng</th>
                <th>Đúng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {sectionResults
                .filter((row) => row.total > 0)
                .map((row) => (
                  <tr key={row.section}>
                    <td>{row.section}</td>
                    <td>{row.correct}</td>
                    <td>{row.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <table>
            <caption>Kết quả theo bài học</caption>
            <thead>
              <tr>
                <th>Bài</th>
                <th>Đúng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {lessonResults.map((row) => (
                <tr key={row.lessonId}>
                  <td>{row.lessonId}</td>
                  <td>{row.correct}</td>
                  <td>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {attempt.questions.map((item, i) => (
            <details key={item.id} className="card history-entry">
              <summary>
                Câu {i + 1} · Bài {item.lessonId} ·{' '}
                {attempt.answers[item.id] === item.correctIndex ? 'Đúng' : 'Sai / chưa trả lời'}
              </summary>
              <h4>{item.question}</h4>
              {item.context ? (
                <p className="preserve-lines" lang="ko">
                  {item.context}
                </p>
              ) : null}
              <p>Bạn chọn: {item.options[attempt.answers[item.id] ?? -1] ?? 'Chưa trả lời'}</p>
              <p>Đáp án: {item.options[item.correctIndex]}</p>
              <p>{item.explanation}</p>
            </details>
          ))}
        </section>
      ) : null}
      {attempt?.status === 'ABANDONED' ? <p>Đề đã dừng. Bạn có thể bắt đầu đề mới.</p> : null}
    </section>
  );
}
