export function PracticePage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Luyện tập</p>
          <h1>Practice</h1>
        </div>
      </header>

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
