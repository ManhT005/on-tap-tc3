import type { ProgressRepository } from '../../repositories/progress.repository';
import { createReviewStatus, gradeReview } from '../review/review-engine';
import type { PracticeSession } from './practice.types';
import { scorePractice, type ScorableQuestion, type ScorePracticeOptions } from './score-practice';

export async function completePracticeSession(
  session: PracticeSession,
  questions: readonly ScorableQuestion[],
  repository: ProgressRepository,
  options: ScorePracticeOptions,
) {
  const result = scorePractice(session, questions, options);
  await repository.savePracticeResult(result);

  const now = new Date(options.completedAt);
  const existingItems = await repository.getReviewItems();
  const itemsByQuestion = new Map(
    existingItems.filter((item) => item.itemType === 'question').map((item) => [item.itemId, item]),
  );
  const wrongQuestionIds = new Set(result.wrongQuestionIds);

  for (const questionId of session.questionIds) {
    const existing = itemsByQuestion.get(questionId);
    const isWrong = wrongQuestionIds.has(questionId);

    if (!existing && !isWrong) continue;

    const reviewItem = existing ?? createReviewStatus(questionId, 'question', now);
    const updated = gradeReview(reviewItem, !isWrong, isWrong ? 1 : 3, now);
    await repository.saveReviewItem(updated);
  }

  if (session.lessonId !== undefined && result.total > 0) {
    const existingProgress = await repository.getLessonProgress(session.lessonId);
    await repository.saveLessonProgress({
      lessonId: session.lessonId,
      status: 'COMPLETED',
      completionPercent: 100,
      startedAt: existingProgress?.startedAt ?? session.startedAt,
      updatedAt: options.completedAt,
      completedAt: options.completedAt,
    });
  }

  return result;
}
