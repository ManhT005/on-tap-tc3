import { COURSE_STRUCTURE } from '../data/course';
import { LessonCard } from '../components/ui/LessonCard';
import { PageHeader } from '../components/ui/PageHeader';

export function LearnPage() {
  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Khóa học"
        title="Learn"
        action={
          <button className="button button--secondary button--md" type="button">
            Tìm bài học
          </button>
        }
      />

      <div className="lesson-grid">
        {COURSE_STRUCTURE.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}
