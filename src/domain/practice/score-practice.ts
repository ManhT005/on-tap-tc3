import type { AssessmentType, PracticeResult, PracticeSession } from './practice.types';

export type ScorableQuestion = {
  id: string | number;
  correctIndex: number;
  question?: string;
  options?: string[];
  explanation?: string;
  evidence?: string;
};

export type ScorePracticeOptions = {
  resultId: string;
  completedAt: string;
  /** BUG-P2-007: Set to SELF_ASSESSED for Writing so it is excluded from objective accuracy. */
  assessmentType?: AssessmentType;
  responses?: Record<string, string>;
};

export function scorePractice(
  session: PracticeSession,
  questions: readonly ScorableQuestion[],
  { resultId, completedAt, assessmentType = 'AUTO_GRADED', responses }: ScorePracticeOptions,
): PracticeResult {
  const questionById = new Map(questions.map((question) => [String(question.id), question]));
  const wrongQuestionIds: string[] = [];
  let correct = 0;

  for (const questionId of session.questionIds) {
    const question = questionById.get(questionId);
    if (!question) {
      throw new Error(`Practice session references missing question "${questionId}".`);
    }

    if (session.answers[questionId] === question.correctIndex) {
      correct += 1;
    } else {
      wrongQuestionIds.push(questionId);
    }
  }

  const total = session.questionIds.length;
  const wrong = total - correct;
  const questionSnapshots = session.questionIds.flatMap((id) => {
    const question = questionById.get(id);
    return question?.question && question.options
      ? [
          {
            id,
            question: question.question,
            options: [...question.options],
            correctIndex: question.correctIndex,
            ...(question.explanation ? { explanation: question.explanation } : {}),
            ...(question.evidence ? { evidence: question.evidence } : {}),
          },
        ]
      : [];
  });

  return {
    id: resultId,
    sessionId: session.id,
    contentVersion: 'tc3-2026-10-11',
    ...(session.lessonId === undefined ? {} : { lessonId: session.lessonId }),
    mode: session.mode,
    assessmentType,
    score: total === 0 ? 0 : Math.round((correct / total) * 100),
    correct,
    wrong,
    total,
    wrongQuestionIds,
    answers: { ...session.answers },
    startedAt: session.startedAt,
    completedAt,
    ...(responses ? { responses: { ...responses } } : {}),
    ...(questionSnapshots.length ? { questionSnapshots } : {}),
  };
}
