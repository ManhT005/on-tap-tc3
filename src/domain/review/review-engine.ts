import type { ReviewStatus } from '../../data/schemas';

export const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
export const WRONG_ANSWER_DELAY_MINUTES = 10;

export type ReviewConfidence = ReviewStatus['confidence'];

export type CalculateNextReviewInput = {
  box: ReviewStatus['box'];
  correct: boolean;
  confidence: ReviewConfidence;
  now: Date;
};

export type ReviewSchedule = {
  box: ReviewStatus['box'];
  intervalDays: number;
  nextReviewAt: string;
};

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

export function calculateNextReview({
  box,
  correct,
  confidence,
  now,
}: CalculateNextReviewInput): ReviewSchedule {
  const nextBox = correct ? Math.min(5, box + 1) : Math.max(0, box - 1);
  const intervalDays = correct && confidence >= 3 ? (REVIEW_INTERVAL_DAYS[nextBox] ?? 0) : 0;
  const nextReviewAt =
    intervalDays > 0 ? addDays(now, intervalDays) : addMinutes(now, WRONG_ANSWER_DELAY_MINUTES);

  return { box: nextBox, intervalDays, nextReviewAt: nextReviewAt.toISOString() };
}

export function createReviewStatus(
  itemId: string,
  itemType: ReviewStatus['itemType'],
  now: Date,
): ReviewStatus {
  const timestamp = now.toISOString();

  return {
    itemId,
    itemType,
    repetitions: 0,
    correctCount: 0,
    wrongCount: 0,
    lastReviewedAt: timestamp,
    nextReviewAt: timestamp,
    intervalDays: 0,
    confidence: 1,
    box: 0,
  };
}

export function gradeReview(
  item: ReviewStatus,
  correct: boolean,
  confidence: ReviewConfidence,
  now: Date,
): ReviewStatus {
  const schedule = calculateNextReview({ box: item.box, correct, confidence, now });

  return {
    ...item,
    repetitions: item.repetitions + 1,
    correctCount: item.correctCount + Number(correct),
    wrongCount: item.wrongCount + Number(!correct),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: schedule.nextReviewAt,
    intervalDays: schedule.intervalDays,
    confidence,
    box: schedule.box,
  };
}
