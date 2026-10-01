import type { PracticeResult, PracticeSession } from './practice.types';

export type ScorableQuestion = {
  id: string | number;
  correctIndex: number;
};

export type ScorePracticeOptions = {
  resultId: string;
  completedAt: string;
};

export function scorePractice(
  session: PracticeSession,
  questions: readonly ScorableQuestion[],
  { resultId, completedAt }: ScorePracticeOptions,
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

  return {
    id: resultId,
    ...(session.lessonId === undefined ? {} : { lessonId: session.lessonId }),
    mode: session.mode,
    score: total === 0 ? 0 : Math.round((correct / total) * 100),
    correct,
    wrong,
    total,
    wrongQuestionIds,
    answers: { ...session.answers },
    startedAt: session.startedAt,
    completedAt,
  };
}
