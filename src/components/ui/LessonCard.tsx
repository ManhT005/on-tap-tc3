import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import type { LessonProgressState } from '../../domain/progress/progress.types';
import type { LearningLessonSummary } from '../../domain/learning/learning.types';
import { Badge } from './Badge';
import { Card } from './Card';

export type LessonCardProps = {
  lesson: LearningLessonSummary;
  status?: LessonProgressState;
  progress?: number;
  className?: string;
};

const statusLabels: Record<LessonProgressState, string> = {
  NOT_STARTED: 'Chưa bắt đầu',
  IN_PROGRESS: 'Đang học',
  COMPLETED: 'Đã hoàn thành',
  NEEDS_REVIEW: 'Cần ôn tập',
};

export function LessonCard({
  lesson,
  status = 'NOT_STARTED',
  progress,
  className,
}: LessonCardProps) {
  const completion = progress ?? (status === 'COMPLETED' ? 100 : 0);
  const actionLabel =
    status === 'NOT_STARTED'
      ? 'Mở bài học'
      : status === 'COMPLETED'
        ? 'Ôn lại bài'
        : 'Tiếp tục học';

  return (
    <Card as="article" className={cn('lesson-card', className)}>
      <div className="lesson-card__header">
        <span className="lesson-number">Bài {String(lesson.id).padStart(2, '0')}</span>
        <Badge className="lesson-card__badge">{statusLabels[status]}</Badge>
      </div>
      <h2>{lesson.koreanTitle}</h2>
      <p className="lesson-card__title">{lesson.title}</p>
      <p>{lesson.topic}</p>
      <p className="lesson-card__importance">Độ quan trọng: {lesson.importance}</p>
      <div className="lesson-meta">
        <span>{lesson.totalQuestions} câu hỏi</span>
      </div>
      <div
        className="lesson-card__progress"
        role="progressbar"
        aria-label={`Tiến độ ${lesson.koreanTitle}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completion}
      >
        <span style={{ width: `${completion}%` }} />
      </div>
      <Link className="button button--ghost button--sm" to={`/learn/${lesson.id}`}>
        {actionLabel}
      </Link>
    </Card>
  );
}
