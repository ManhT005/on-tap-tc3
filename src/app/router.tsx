import { createBrowserRouter, useParams } from 'react-router-dom';
import { COURSE_STRUCTURE } from '../data/course';
import { AppShell } from './AppShell';

function Placeholder({ title }: { title: string }) {
  return (
    <section className="page-placeholder">
      <h1>{title}</h1>
      <p>Màn hình này sẽ được triển khai ở phase tiếp theo.</p>
    </section>
  );
}

function HomePage() {
  return (
    <section className="page-panel">
      <header className="page-header">
        <div>
          <p className="eyebrow">Bắt đầu ngay</p>
          <h1>Home</h1>
        </div>
        <button className="button button--primary button--lg" type="button">
          Bắt đầu ôn từ Bài 1
        </button>
      </header>

      <div className="stats-grid">
        <article className="stat-card card">
          <span className="stat-label">Số bài học</span>
          <strong>{COURSE_STRUCTURE.length}</strong>
        </article>
        <article className="stat-card card">
          <span className="stat-label">Tổng từ vựng</span>
          <strong>15 bài</strong>
        </article>
        <article className="stat-card card">
          <span className="stat-label">Mẫu ngữ pháp</span>
          <strong>3+ dạng</strong>
        </article>
      </div>

      <div className="feature-grid">
        <article className="feature-card card">
          <p className="feature-kicker">Tiếp tục học</p>
          <h2>Bài 01 · 학교생활</h2>
          <p>Đời sống học đường &amp; Học vụ</p>
        </article>
        <article className="feature-card card">
          <p className="feature-kicker">Ôn tập nhanh</p>
          <h2>Chưa có lịch ôn</h2>
          <p>Hoàn thành một bài học để tạo hàng đợi ôn tập.</p>
        </article>
      </div>
    </section>
  );
}

function LearnPage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Khóa học</p>
          <h1>Learn</h1>
        </div>
        <button className="button button--secondary button--md" type="button">
          Tìm bài học
        </button>
      </header>

      <div className="lesson-grid">
        {COURSE_STRUCTURE.map((lesson) => (
          <article key={lesson.id} className="lesson-card card">
            <div className="lesson-card__header">
              <span className="lesson-number">Bài {String(lesson.id).padStart(2, '0')}</span>
              <span className="lesson-card__badge">{lesson.importance}</span>
            </div>
            <h2>{lesson.koreanTitle}</h2>
            <p>{lesson.topic}</p>
            <div className="lesson-meta">
              <span>{lesson.totalQuestions} câu hỏi</span>
              <span>{lesson.title}</span>
            </div>
            <a className="button button--ghost button--sm" href={`/learn/${lesson.id}`}>
              Mở bài học
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function LessonDetailPage() {
  const { lessonId: lessonIdParam } = useParams();
  const lessonId = Number(lessonIdParam ?? 1);
  const lesson = COURSE_STRUCTURE.find((item) => item.id === lessonId) ?? COURSE_STRUCTURE[0];

  if (!lesson) {
    return null;
  }

  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Bài học</p>
          <h1>Bài {String(lesson.id).padStart(2, '0')}</h1>
        </div>
        <a className="button button--secondary button--md" href="/learn">
          Quay lại Learn
        </a>
      </header>

      <div className="lesson-detail card">
        <h2>{lesson.koreanTitle}</h2>
        <p>{lesson.title}</p>
        <div className="detail-metrics">
          <span>{lesson.topic}</span>
          <span>{lesson.totalQuestions} câu hỏi</span>
          <span>{lesson.importance}</span>
        </div>
        <p className="detail-note">
          Chi tiết nội dung bài học sẽ được hoàn thiện ở Phase 2, nhưng cấu trúc shell và design
          token đã được chuẩn hóa.
        </p>
      </div>
    </section>
  );
}

function ReviewPage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Ôn tập</p>
          <h1>Review</h1>
        </div>
      </header>

      <div className="empty-state card">
        <h2>Chưa có nội dung cần ôn</h2>
        <p>Ôn lại những nội dung bạn đã học và các câu từng làm sai sẽ xuất hiện ở đây.</p>
      </div>
    </section>
  );
}

function PracticePage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Luyện tập</p>
          <h1>Practice</h1>
        </div>
      </header>

      <div className="practice-grid">
        {['Quiz', 'Reading', 'Writing', 'Exam'].map((mode) => (
          <article key={mode} className="practice-card card">
            <span className="badge badge--neutral">{mode}</span>
            <h2>{mode}</h2>
            <p>{mode === 'Exam' ? 'Chưa sẵn sàng cho Phase 1' : 'Mở ngay để bắt đầu luyện tập.'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgressPage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Tiến độ</p>
          <h1>Progress</h1>
        </div>
      </header>

      <div className="empty-state card">
        <h2>Chưa có dữ liệu tiến độ</h2>
        <p>Tiến độ học tập và thống kê sẽ xuất hiện sau khi có persistence thực tế.</p>
      </div>
    </section>
  );
}

export const routes = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'learn', element: <LearnPage /> },
      {
        path: 'learn/:lessonId',
        element: <LessonDetailPage />,
      },
      { path: 'review', element: <ReviewPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: '*', element: <Placeholder title="Not Found" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
