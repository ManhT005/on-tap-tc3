import { useState } from 'react';
import { LessonCard } from '../components/ui/LessonCard';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useLessons } from '../features/learning/state/use-lessons';
import type { LessonProgressState } from '../domain/progress/progress.types';

type LessonFilter = 'all' | 'not-started' | 'in-progress' | 'completed';

const filters: { id: LessonFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'not-started', label: 'Chưa bắt đầu' },
  { id: 'in-progress', label: 'Đang học' },
  { id: 'completed', label: 'Đã hoàn thành' },
];

function getStatus(status?: LessonProgressState): LessonProgressState {
  return status ?? 'NOT_STARTED';
}

export function LearnPage() {
  const { lessons, progressByLesson, loading, error } = useLessons();
  const [filter, setFilter] = useState<LessonFilter>('all');
  const visibleLessons = lessons.filter((lesson) => {
    const status = getStatus(progressByLesson[lesson.id]?.status);
    if (filter === 'not-started') return status === 'NOT_STARTED';
    if (filter === 'in-progress') return status === 'IN_PROGRESS';
    if (filter === 'completed') return status === 'COMPLETED';
    return true;
  });

  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Khóa học"
        title="Learn"
        description="Chọn bài học để tiếp tục tiến bộ."
      />

      <div className="lesson-filters" role="group" aria-label="Lọc bài học">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            className={filter === id ? 'lesson-filter lesson-filter--active' : 'lesson-filter'}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <EmptyState title="Không tải được tiến độ" description={error} role="alert" />
      ) : null}

      {loading ? (
        <div className="lesson-grid" aria-label="Đang tải bài học">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} height="220px" />
          ))}
        </div>
      ) : visibleLessons.length > 0 ? (
        <div className="lesson-grid">
          {visibleLessons.map((lesson) => {
            const progress = progressByLesson[lesson.id];
            const status = getStatus(progress?.status);
            const completion = progress?.completionPercent ?? (status === 'COMPLETED' ? 100 : 0);

            return (
              <LessonCard key={lesson.id} lesson={lesson} status={status} progress={completion} />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Không có bài học phù hợp"
          description="Thử chọn bộ lọc khác để xem các bài học."
        />
      )}
    </section>
  );
}
