import { describe, expect, it } from 'vitest';
import { ReviewStatusSchema } from '../../data/schemas';
import {
  calculateNextReview,
  createReviewStatus,
  gradeReview,
  REVIEW_INTERVAL_DAYS,
} from './review-engine';
import { getDueReviewItems, sortReviewQueue } from './review-queue';

const now = new Date('2026-10-01T08:00:00.000Z');

function createItem(overrides: Partial<ReturnType<typeof createReviewStatus>> = {}) {
  return ReviewStatusSchema.parse({
    ...createReviewStatus('item-1', 'vocabulary', now),
    repetitions: 2,
    correctCount: 2,
    box: 2,
    ...overrides,
  });
}

describe('calculateNextReview', () => {
  it('lowers the box after an incorrect answer and schedules a near-term review', () => {
    const result = calculateNextReview({ box: 2, correct: false, confidence: 1, now });

    expect(result.box).toBe(1);
    expect(result.intervalDays).toBe(0);
    expect(result.nextReviewAt).toBe('2026-10-01T08:10:00.000Z');
  });

  it('promotes a confident correct answer using the new box interval', () => {
    const result = calculateNextReview({ box: 2, correct: true, confidence: 4, now });

    expect(result.box).toBe(3);
    expect(result.intervalDays).toBe(REVIEW_INTERVAL_DAYS[3]);
    expect(result.nextReviewAt).toBe('2026-10-08T08:00:00.000Z');
  });

  it('keeps boxes within zero and five', () => {
    expect(calculateNextReview({ box: 0, correct: false, confidence: 1, now }).box).toBe(0);
    expect(calculateNextReview({ box: 5, correct: true, confidence: 4, now }).box).toBe(5);
  });

  it('keeps low-confidence correct answers due later the same day', () => {
    const result = calculateNextReview({ box: 0, correct: true, confidence: 2, now });

    expect(result.box).toBe(1);
    expect(result.intervalDays).toBe(0);
    expect(result.nextReviewAt).toBe('2026-10-01T08:10:00.000Z');
  });
});

describe('gradeReview', () => {
  it('updates counters, confidence, and timestamps', () => {
    const result = gradeReview(createItem(), false, 1, now);

    expect(result).toMatchObject({
      repetitions: 3,
      correctCount: 2,
      wrongCount: 1,
      confidence: 1,
      box: 1,
      lastReviewedAt: now.toISOString(),
    });
    expect(ReviewStatusSchema.safeParse(result).success).toBe(true);
  });
});

describe('review queue', () => {
  it('includes items due now and excludes future items', () => {
    const due = createItem({ itemId: 'due', nextReviewAt: now.toISOString() });
    const future = createItem({ itemId: 'future', nextReviewAt: '2026-10-02T08:00:00.000Z' });

    expect(getDueReviewItems([future, due], now).map((item) => item.itemId)).toEqual(['due']);
  });

  it('sorts earliest due first and prioritizes repeated mistakes on ties', () => {
    const later = createItem({ itemId: 'later', nextReviewAt: '2026-10-02T08:00:00.000Z' });
    const fewerWrong = createItem({ itemId: 'fewer', wrongCount: 1 });
    const moreWrong = createItem({ itemId: 'more', wrongCount: 3 });

    expect(sortReviewQueue([later, fewerWrong, moreWrong]).map((item) => item.itemId)).toEqual([
      'more',
      'fewer',
      'later',
    ]);
  });
});
