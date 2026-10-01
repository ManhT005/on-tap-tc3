import { COURSE_STRUCTURE } from '../data/course';

export function HomePage() {
  return (
    <section className="page-panel">
      <header className="page-header">
        <div>
          <p className="eyebrow">Bắt đầu ngay</p>
          <h1>Home</h1>
        </div>
        <button className="button button--primary button--lg" type="button">
          Bắt đầu ôn từ Bài 1
        </button>
      </header>

      <div className="stats-grid">
        <article className="stat-card card">
          <span className="stat-label">Số bài học</span>
          <strong>{COURSE_STRUCTURE.length}</strong>
        </article>
        <article className="stat-card card">
          <span className="stat-label">Tổng từ vựng</span>
          <strong>15 bài</strong>
        </article>
        <article className="stat-card card">
          <span className="stat-label">Mẫu ngữ pháp</span>
          <strong>3+ dạng</strong>
        </article>
      </div>

      <div className="feature-grid">
        <article className="feature-card card">
          <p className="feature-kicker">Tiếp tục học</p>
          <h2>Bài 01 · 학교생활</h2>
          <p>Đời sống học đường &amp; Học vụ</p>
        </article>
        <article className="feature-card card">
          <p className="feature-kicker">Ôn tập nhanh</p>
          <h2>Chưa có lịch ôn</h2>
          <p>Hoàn thành một bài học để tạo hàng đợi ôn tập.</p>
        </article>
      </div>
    </section>
  );
}
