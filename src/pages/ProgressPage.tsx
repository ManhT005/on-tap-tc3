import { useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatTile } from '../components/ui/StatTile';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useProgressRepository } from '../app/providers/ProgressRepositoryProvider';
import { useCourseDashboard } from '../features/progress/state/use-course-dashboard';

export function ProgressPage() {
  const { storageStatus } = useProgressRepository();
  const [reloadKey, setReloadKey] = useState(0);
  const { progress, loading, error } = useCourseDashboard(reloadKey);

  const isDegraded = storageStatus === 'degraded';

  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Tiến độ"
        title="Progress"
        description="Tổng hợp việc học và luyện tập trên thiết bị này."
      />

      {isDegraded ? (
        <p className="storage-warning" role="status">
          ⚠️ Bộ nhớ lâu dài không khả dụng — tiến độ hiển thị chỉ phản ánh phiên làm việc hiện tại,
          không phải dữ liệu đã lưu trước đó.
        </p>
      ) : null}

      {/* Error takes priority over loading — never show skeleton when we have an error */}
      {error ? (
        <EmptyState
          title="Không tải được dữ liệu"
          description={error}
          role="alert"
          action={
            <Button variant="secondary" onClick={() => setReloadKey((k) => k + 1)}>
              Thử lại
            </Button>
          }
        />
      ) : loading || !progress ? (
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
