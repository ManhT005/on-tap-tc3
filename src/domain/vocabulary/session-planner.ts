import type { ReviewStatus } from '../../data/schemas';
import type { VocabularyEntry, VocabularyFilter } from './vocabulary.types';

export function filterVocabulary(
  entries: VocabularyEntry[],
  options: {
    lessonId: number;
    filter: VocabularyFilter;
    query: string;
    studied: string[];
    reviews: ReviewStatus[];
    now: string;
  },
) {
  const query = options.query.normalize('NFC').trim().toLocaleLowerCase('vi');
  const studied = new Set(options.studied);
  const reviews = new Map(
    options.reviews
      .filter((item) => item.itemType === 'vocabulary')
      .map((item) => [item.itemId, item]),
  );
  return entries.filter((entry) => {
    const review = reviews.get(entry.id);
    return (
      entry.lessonId === options.lessonId &&
      (!query ||
        `${entry.korean} ${entry.vietnamese} ${entry.collocations.join(' ')}`
          .normalize('NFC')
          .toLocaleLowerCase('vi')
          .includes(query)) &&
      (options.filter === 'all' ||
        options.filter === entry.source ||
        (options.filter === 'unseen' && !studied.has(entry.id)) ||
        (options.filter === 'review' &&
          review &&
          (review.nextReviewAt <= options.now || review.confidence <= 2)))
    );
  });
}

export function planVocabularyBatch(
  entries: VocabularyEntry[],
  size: 5 | 10 | 15,
  studied: string[],
  reviews: ReviewStatus[],
  exclude: string[] = [],
) {
  const known = new Set(studied);
  const skipped = new Set(exclude);
  const weak = new Set(
    reviews
      .filter((item) => item.itemType === 'vocabulary' && item.confidence <= 2)
      .map((item) => item.itemId),
  );
  const rank = (entry: VocabularyEntry) => (weak.has(entry.id) ? 0 : !known.has(entry.id) ? 1 : 2);
  return entries
    .filter((entry) => !skipped.has(entry.id))
    .sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id))
    .slice(0, size)
    .map((entry) => entry.id);
}
