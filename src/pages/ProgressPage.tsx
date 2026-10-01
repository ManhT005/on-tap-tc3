export function ProgressPage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Tiến độ</p>
          <h1>Progress</h1>
        </div>
      </header>

      <div className="empty-state card">
        <h2>Chưa có dữ liệu tiến độ</h2>
        <p>Tiến độ học tập và thống kê sẽ xuất hiện sau khi có persistence thực tế.</p>
      </div>
    </section>
  );
}
