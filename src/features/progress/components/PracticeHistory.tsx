import { useEffect, useState } from 'react';
import type { PracticeResult } from '../../../domain/practice/practice.types';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { Button } from '../../../components/ui/Button';

export function PracticeHistory() {
  const { repository, storageRevision } = useProgressRepository();
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [filter, setFilter] = useState('all');
  const [lesson, setLesson] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let active = true;
    repository
      .getPracticeResults()
      .then((items) => {
        if (active) {
          setResults(items);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError('Không tải được lịch sử.');
      });
    return () => {
      active = false;
    };
  }, [repository, storageRevision, tick]);
  const filtered = results.filter(
    (result) =>
      (filter === 'all' || result.mode === filter) &&
      (lesson === 'all' || result.lessonId === Number(lesson)),
  );
  return (
    <section className="review-section" aria-labelledby="practice-history-title">
      <h2 id="practice-history-title">Lịch sử luyện tập</h2>
      <div className="practice-controls">
        <label>
          Kỹ năng
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">Tất cả kỹ năng</option>
            {['lesson', 'quiz', 'reading', 'writing', 'listening', 'exam'].map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
        <label>
          Bài trong lịch sử
          <select value={lesson} onChange={(event) => setLesson(event.target.value)}>
            <option value="all">Tất cả bài</option>
            {Array.from({ length: 15 }, (_, index) => (
              <option key={index} value={index + 1}>
                Bài {index + 1}
              </option>
            ))}
          </select>
        </label>
        <Button variant="secondary" onClick={() => setTick((value) => value + 1)}>
          Tải lại lịch sử
        </Button>
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {!error && filtered.length === 0 ? <p>Chưa có kết quả cho bộ lọc này.</p> : null}
      {filtered.slice(0, 100).map((result) => (
        <details key={result.id} className="card history-entry">
          <summary>
            {result.mode} · {result.lessonId ? `Bài ${result.lessonId} · ` : ''}
            {new Date(result.completedAt).toLocaleString('vi-VN')} ·{' '}
            {result.assessmentType === 'SELF_ASSESSED'
              ? `Tự đánh giá: ${result.correct ? 'Đạt yêu cầu' : 'Cần luyện thêm'}`
              : `${result.score}% (${result.correct}/${result.total})`}
          </summary>
          {result.responses
            ? Object.entries(result.responses).map(([id, response]) => (
                <div key={id}>
                  <h3>Bài viết đã nộp</h3>
                  <p className="preserve-lines" lang="ko">
                    {response}
                  </p>
                  <p>Đây là tự đánh giá, không được tính vào độ chính xác khách quan.</p>
                </div>
              ))
            : null}
          {result.questionSnapshots?.map((question) => {
            const selected = result.answers[question.id];
            return (
              <article key={question.id} className="history-answer">
                <h3>{question.question}</h3>
                <p>
                  Bạn chọn:{' '}
                  {typeof selected === 'number'
                    ? (question.options[selected] ?? 'Không có đáp án')
                    : 'Chưa trả lời'}
                </p>
                <p>Đáp án: {question.options[question.correctIndex]}</p>
                <p>{question.explanation ?? question.evidence}</p>
              </article>
            );
          })}
          {!result.questionSnapshots?.length && !result.responses ? (
            <p>
              Kết quả cũ chưa lưu nội dung câu hỏi. Đúng {result.correct}, sai {result.wrong}.
            </p>
          ) : null}
        </details>
      ))}
      {filtered.length > 100 ? (
        <p>Hiển thị 100 lượt gần nhất. Bản sao lưu chứa toàn bộ lịch sử.</p>
      ) : null}
    </section>
  );
}
