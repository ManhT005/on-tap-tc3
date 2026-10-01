import { Link, useParams } from 'react-router-dom';
import { COURSE_STRUCTURE } from '../data/course';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

export function LessonPage() {
  const { lessonId: lessonIdParam } = useParams();
  const lessonId = Number(lessonIdParam);
  const lesson = COURSE_STRUCTURE.find((item) => item.id === lessonId);

  if (!lesson) {
    return (
      <section className="page-panel">
        <EmptyState
          title="Không tìm thấy bài học"
          description="Bài học bạn đang tìm không tồn tại hoặc đường dẫn không hợp lệ."
          headingLevel="h1"
          role="alert"
          action={
            <Link className="button button--secondary button--md" to="/learn">
              Quay lại Learn
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Bài học"
        title={`Bài ${String(lesson.id).padStart(2, '0')}`}
        action={
          <Link className="button button--secondary button--md" to="/learn">
            Quay lại Learn
          </Link>
        }
      />

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
