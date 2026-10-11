import type { ProgressRepository } from '../../repositories/progress.repository';
import type { LessonProgress } from '../progress/progress.types';
import type { PracticeSession } from './practice.types';
import { scorePractice, type ScorableQuestion, type ScorePracticeOptions } from './score-practice';

export async function completePracticeSession(
  session: PracticeSession,
  questions: readonly ScorableQuestion[],
  repository: ProgressRepository,
  options: ScorePracticeOptions,
) {
  const result = scorePractice(session, questions, options);

  const wrongQuestionIds = new Set(result.wrongQuestionIds);

  // Build lesson progress update if applicable.
  let lessonProgress: LessonProgress | undefined;
  if (session.mode === 'lesson' && session.lessonId !== undefined && result.total > 0) {
    const existingProgress = await repository.getLessonProgress(session.lessonId);
    lessonProgress = {
      lessonId: session.lessonId,
      status: 'COMPLETED',
      completionPercent: 100,
      startedAt: existingProgress?.startedAt ?? session.startedAt,
      updatedAt: options.completedAt,
      completedAt: options.completedAt,
    };
  }

  // Commit everything atomically — no partial state on failure.
  return repository.commitPracticeCompletion({
    sessionId: session.id,
    result,
    reviewCommands: session.questionIds.map((itemId) => ({
      eventId: `${session.id}:question:${itemId}`,
      itemId,
      itemType: 'question',
      correct: !wrongQuestionIds.has(itemId),
      confidence: wrongQuestionIds.has(itemId) ? 1 : 3,
      gradedAt: options.completedAt,
      onlyIfTracked: !wrongQuestionIds.has(itemId),
    })),
    lessonProgress,
  });
}
