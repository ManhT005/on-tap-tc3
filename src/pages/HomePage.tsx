import { COURSE_STRUCTURE } from '../data/course';
import { PageHeader } from '../components/ui/PageHeader';
import { StatTile } from '../components/ui/StatTile';

export function HomePage() {
  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Bắt đầu ngay"
        title="Home"
        stacked={false}
        action={
          <button className="button button--primary button--lg" type="button">
            Bắt đầu ôn từ Bài 1
          </button>
        }
      />

      <div className="stats-grid">
        <StatTile label="Số bài học" value={COURSE_STRUCTURE.length} />
        <StatTile label="Tổng từ vựng" value="15 bài" />
        <StatTile label="Mẫu ngữ pháp" value="3+ dạng" />
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
