import { Link, useParams } from 'react-router-dom';
import { COURSE_STRUCTURE } from '../data/course';

export function LessonPage() {
  const { lessonId: lessonIdParam } = useParams();
  const lessonId = Number(lessonIdParam);
  const lesson = COURSE_STRUCTURE.find((item) => item.id === lessonId);

  if (!lesson) {
    return (
      <section className="page-panel">
        <div className="empty-state card" role="alert">
          <h1>Không tìm thấy bài học</h1>
          <p>Bài học bạn đang tìm không tồn tại hoặc đường dẫn không hợp lệ.</p>
          <Link className="button button--secondary button--md" to="/learn">
            Quay lại Learn
          </Link>
        </div>
      </section>
    );
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
