export function ReviewPage() {
  return (
    <section className="page-panel">
      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Ôn tập</p>
          <h1>Review</h1>
        </div>
      </header>

      <div className="empty-state card">
        <h2>Chưa có nội dung cần ôn</h2>
        <p>Ôn lại những nội dung bạn đã học và các câu từng làm sai sẽ xuất hiện ở đây.</p>
      </div>
    </section>
  );
}
