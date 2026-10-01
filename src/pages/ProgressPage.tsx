import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatTile } from '../components/ui/StatTile';
import { Skeleton } from '../components/ui/Skeleton';
import { useCourseDashboard } from '../features/progress/state/use-course-dashboard';

export function ProgressPage() {
  const { progress, loading, error } = useCourseDashboard();

  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Tiến độ"
        title="Progress"
        description="Tổng hợp việc học và luyện tập trên thiết bị này."
      />

      {error ? (
        <EmptyState title="Không tải được dữ liệu" description={error} role="alert" />
      ) : null}
      {loading || !progress ? (
        <div className="stats-grid" aria-label="Đang tải tiến độ">
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} height="120px" />
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          <StatTile label="Bài đã hoàn thành" value={progress.lessonsCompleted} />
          <StatTile label="Bài đang học" value={progress.lessonsInProgress} />
          <StatTile label="Lượt luyện tập" value={progress.practiceSessions} />
          <StatTile label="Độ chính xác" value={`${progress.accuracy}%`} />
          <StatTile label="Mục ôn đến hạn" value={progress.reviewsDue} />
          <StatTile label="Từ vựng đã ôn" value={progress.vocabularyReviewed} />
          <StatTile label="Ngữ pháp đã ôn" value={progress.grammarReviewed} />
        </div>
      )}
    </section>
  );
}
