import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

export function ReviewPage() {
  return (
    <section className="page-panel">
      <PageHeader eyebrow="Ôn tập" title="Review" />

      <EmptyState
        title="Chưa có nội dung cần ôn"
        description="Ôn lại những nội dung bạn đã học và các câu từng làm sai sẽ xuất hiện ở đây."
      />
    </section>
  );
}
