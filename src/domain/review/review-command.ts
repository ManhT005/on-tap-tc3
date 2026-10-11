import type { ReviewStatus } from '../../data/schemas';
import type { LessonEvent } from '../progress/lesson-progress';
import { createReviewStatus, gradeReview, type ReviewConfidence } from './review-engine';

/** An event, never a precomputed status from a UI snapshot. */
export type ReviewCommand = {
  eventId: string;
  itemId: string;
  itemType: ReviewStatus['itemType'];
  correct: boolean;
  confidence: ReviewConfidence;
  gradedAt: string;
  kind?: 'grade' | 'mark';
  onlyIfTracked?: boolean;
  lessonEvent?: LessonEvent;
};

export function applyReviewCommand(current: ReviewStatus | undefined, command: ReviewCommand) {
  const now = new Date(command.gradedAt);
  if (
    !command.eventId ||
    !command.itemId ||
    !Number.isFinite(now.getTime()) ||
    ![1, 2, 3, 4].includes(command.confidence)
  ) {
    throw new Error('Invalid review event.');
  }
  if (!current && command.onlyIfTracked) return undefined;
  const initial = current ?? createReviewStatus(command.itemId, command.itemType, now);
  return command.kind === 'mark'
    ? initial
    : gradeReview(initial, command.correct, command.confidence, now);
}
