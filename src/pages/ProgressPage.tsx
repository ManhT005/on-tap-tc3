import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

export function ProgressPage() {
  return (
    <section className="page-panel">
      <PageHeader eyebrow="Tiến độ" title="Progress" />

      <EmptyState
        title="Chưa có dữ liệu tiến độ"
        description="Tiến độ học tập và thống kê sẽ xuất hiện sau khi có persistence thực tế."
      />
    </section>
  );
}
