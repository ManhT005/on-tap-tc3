import { COURSE_STRUCTURE } from '../data/course';

export function LearnPage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Khóa học</p>
          <h1>Learn</h1>
        </div>
        <button className="button button--secondary button--md" type="button">
          Tìm bài học
        </button>
      </header>

      <div className="lesson-grid">
        {COURSE_STRUCTURE.map((lesson) => (
          <article key={lesson.id} className="lesson-card card">
            <div className="lesson-card__header">
              <span className="lesson-number">Bài {String(lesson.id).padStart(2, '0')}</span>
              <span className="lesson-card__badge">{lesson.importance}</span>
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
          </article>
        ))}
      </div>
    </section>
  );
}
