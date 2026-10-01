import { COURSE_STRUCTURE } from '../../data/course';
import { cn } from '../../utils/cn';
import { Badge } from './Badge';
import { Card } from './Card';

type Lesson = (typeof COURSE_STRUCTURE)[number];

export type LessonCardProps = {
  lesson: Lesson;
  className?: string;
};

export function LessonCard({ lesson, className }: LessonCardProps) {
  return (
    <Card as="article" className={cn('lesson-card', className)}>
      <div className="lesson-card__header">
        <span className="lesson-number">Bài {String(lesson.id).padStart(2, '0')}</span>
        <Badge className="lesson-card__badge">{lesson.importance}</Badge>
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
    </Card>
  );
}
