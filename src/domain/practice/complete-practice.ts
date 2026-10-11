import type { ProgressRepository } from '../../repositories/progress.repository';
import type { LessonEvent } from '../progress/lesson-progress';
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
  let lessonEvent: LessonEvent | undefined;
  if (session.mode === 'lesson' && session.lessonId !== undefined && result.total > 0) {
    lessonEvent = { lessonId: session.lessonId, kind: 'quiz', occurredAt: options.completedAt };
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
    lessonEvent,
  });
}
