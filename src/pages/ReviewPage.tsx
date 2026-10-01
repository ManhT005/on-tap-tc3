import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { ReviewQueueItem } from '../components/learning/ReviewQueueItem';
import { useReviewQueue } from '../features/review/state/use-review-queue';

export function ReviewPage() {
  const { dueItems, recentMistakes, loading, error, grade } = useReviewQueue();
  const validDueItems = dueItems.filter(
    (entry): entry is typeof entry & { content: NonNullable<typeof entry.content> } =>
      entry.content !== null,
  );
  const validRecentMistakes = recentMistakes.filter(
    (entry): entry is typeof entry & { content: NonNullable<typeof entry.content> } =>
      entry.content !== null,
  );

  return (
    <section className="page-panel">
      <PageHeader eyebrow="Ôn tập" title="Review" description="Ôn đúng lúc để ghi nhớ lâu hơn." />

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <section className="review-section" aria-labelledby="due-review-title">
        <header className="review-section__heading">
          <h2 id="due-review-title">Đến hạn</h2>
          <span>{validDueItems.length} mục</span>
        </header>
        {loading ? (
          <Skeleton height="200px" />
        ) : validDueItems.length ? (
          <div className="review-queue">
            {validDueItems.map(({ item, content }) => (
              <ReviewQueueItem
                key={`${item.itemType}:${item.itemId}`}
                item={item}
                content={content}
                onGrade={(confidence) => void grade(item, confidence)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Bạn đã ôn hết mục đến hạn"
            description="Mục cần ôn tiếp theo sẽ xuất hiện tại đây khi đến lịch."
          />
        )}
      </section>

      <section className="review-section" aria-labelledby="recent-mistakes-title">
        <header className="review-section__heading">
          <h2 id="recent-mistakes-title">Lỗi gần đây</h2>
          <span>{validRecentMistakes.length} mục</span>
        </header>
        {validRecentMistakes.length ? (
          <ul className="recent-mistakes">
            {validRecentMistakes.map(({ item, content }) => (
              <li key={`${item.itemType}:${item.itemId}`}>
                <span>{content.prompt}</span>
                <span>{item.wrongCount} lần sai</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-copy">Các câu trả lời sai sẽ được lưu tại đây.</p>
        )}
      </section>
    </section>
  );
}
