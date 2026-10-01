import { PageHeader } from '../components/ui/PageHeader';

export function PracticePage() {
  return (
    <section className="page-panel">
      <PageHeader eyebrow="Luyện tập" title="Practice" />

      <div className="practice-grid">
        {['Quiz', 'Reading', 'Writing', 'Exam'].map((mode) => (
          <article key={mode} className="practice-card card">
            <span className="badge badge--neutral">{mode}</span>
            <h2>{mode}</h2>
            <p>{mode === 'Exam' ? 'Chưa sẵn sàng cho Phase 1' : 'Mở ngay để bắt đầu luyện tập.'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
