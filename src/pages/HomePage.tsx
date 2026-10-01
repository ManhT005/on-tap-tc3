import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatTile } from '../components/ui/StatTile';
import { Skeleton } from '../components/ui/Skeleton';
import { useCourseDashboard } from '../features/progress/state/use-course-dashboard';

export function HomePage() {
  const { progress, nextLessonId, loading, error } = useCourseDashboard();

  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Bắt đầu ngay"
        title="Home"
        stacked={false}
        action={
          <Link className="button button--primary button--lg" to={`/learn/${nextLessonId ?? 1}`}>
            {nextLessonId ? 'Tiếp tục học' : 'Ôn lại bài học'}
          </Link>
        }
      />

      {error ? (
        <EmptyState title="Không tải được dữ liệu" description={error} role="alert" />
      ) : null}

      {loading || !progress ? (
        <div className="dashboard-grid" aria-label="Đang tải tiến độ">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} height="150px" />
          ))}
        </div>
      ) : (
        <div className="dashboard-grid">
          <article className="dashboard-tile card">
            <p className="feature-kicker">Tiếp tục học</p>
            <h2>
              {nextLessonId
                ? `Bài ${String(nextLessonId).padStart(2, '0')}`
                : 'Đã hoàn thành khóa học'}
            </h2>
            <p>
              {nextLessonId
                ? 'Tiến độ được lưu tự động trên thiết bị.'
                : 'Bạn có thể ôn lại bất kỳ bài học nào.'}
            </p>
            <Link
              className="button button--secondary button--md"
              to={`/learn/${nextLessonId ?? 1}`}
            >
              {nextLessonId ? 'Mở bài học' : 'Ôn lại bài học'}
            </Link>
          </article>
          <Link className="dashboard-tile dashboard-tile--link card" to="/review">
            <p className="feature-kicker">Ôn tập</p>
            <h2>{progress.reviewsDue}</h2>
            <p>Mục đến hạn hôm nay</p>
            <span className="dashboard-tile__cta">Mở hàng đợi ôn</span>
          </Link>
          <StatTile label="Bài đã hoàn thành" value={progress.lessonsCompleted} />
          <StatTile label="Độ chính xác luyện tập" value={`${progress.accuracy}%`} />
        </div>
      )}
    </section>
  );
}
