import { scorePractice } from '../practice/score-practice';
import {
  ExamAttemptSchema,
  ExamBlueprintSchema,
  type ExamAttempt,
  type ExamBlueprint,
  type ExamMutation,
  type ExamQuestion,
} from './exam.types';

export const CORE_EXAM_BLUEPRINT: ExamBlueprint = {
  id: 'tc3-core-v1',
  version: 1,
  timed: true,
  durationMinutes: 30,
  sections: { quiz: 20, reading: 10, listening: 0 },
};
export const MIXED_EXAM_BLUEPRINT: ExamBlueprint = {
  id: 'tc3-mixed-v1',
  version: 1,
  timed: true,
  durationMinutes: 30,
  sections: { quiz: 20, reading: 5, listening: 5 },
};

function rng(seed: string) {
  let state = 2166136261;
  for (const character of seed) state = Math.imul(state ^ character.charCodeAt(0), 16777619) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createExamAttempt(
  id: string,
  blueprint: ExamBlueprint,
  bank: readonly ExamQuestion[],
  seed: string,
  now: Date,
): ExamAttempt {
  ExamBlueprintSchema.parse(blueprint);
  if (new Set(bank.map((question) => question.id)).size !== bank.length)
    throw new Error('Question bank contains duplicate IDs.');
  const random = rng(seed);
  const questions: ExamQuestion[] = [];
  for (const section of ['quiz', 'reading', 'listening'] as const) {
    const candidates = bank
      .filter((question) => question.section === section)
      .sort((a, b) => a.id.localeCompare(b.id));
    if (candidates.length < blueprint.sections[section])
      throw new Error(`Insufficient ${section} questions for this blueprint.`);
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j]!, candidates[i]!];
    }
    questions.push(...candidates.slice(0, blueprint.sections[section]));
  }
  return ExamAttemptSchema.parse({
    id,
    blueprint,
    seed,
    questions: structuredClone(questions),
    status: 'CREATED',
    answers: {},
    flaggedIds: [],
    createdAt: now.toISOString(),
  });
}

export function startExam(attempt: ExamAttempt, now: Date): ExamAttempt {
  if (attempt.status !== 'CREATED') return attempt;
  return ExamAttemptSchema.parse({
    ...attempt,
    status: 'IN_PROGRESS',
    startedAt: now.toISOString(),
    ...(attempt.blueprint.timed
      ? {
          deadlineAt: new Date(
            now.getTime() + attempt.blueprint.durationMinutes * 60_000,
          ).toISOString(),
        }
      : {}),
  });
}

export function isExamExpired(attempt: ExamAttempt, now: Date) {
  return attempt.deadlineAt !== undefined && now.getTime() >= Date.parse(attempt.deadlineAt);
}

export function mutateExam(attempt: ExamAttempt, mutation: ExamMutation, now: Date): ExamAttempt {
  if (attempt.status !== 'IN_PROGRESS') throw new Error('Exam is no longer in progress.');
  if (mutation.kind === 'abandon')
    return { ...attempt, status: 'ABANDONED', completedAt: now.toISOString() };
  if (isExamExpired(attempt, now)) throw new Error('Exam deadline has passed.');
  if (!attempt.questions.some((question) => question.id === mutation.questionId))
    throw new Error('Unknown exam question.');
  if (mutation.kind === 'answer') {
    if (!Number.isInteger(mutation.answer) || mutation.answer < 0 || mutation.answer > 3)
      throw new Error('Invalid answer index.');
    return { ...attempt, answers: { ...attempt.answers, [mutation.questionId]: mutation.answer } };
  }
  const flags = new Set(attempt.flaggedIds);
  if (flags.has(mutation.questionId)) flags.delete(mutation.questionId);
  else flags.add(mutation.questionId);
  return { ...attempt, flaggedIds: [...flags] };
}

export function completeExam(attempt: ExamAttempt, now: Date) {
  if (attempt.status !== 'IN_PROGRESS')
    throw new Error('Exam cannot be submitted from this state.');
  const result = scorePractice(
    {
      id: attempt.id,
      mode: 'exam',
      questionIds: attempt.questions.map((question) => question.id),
      answers: attempt.answers,
      startedAt: attempt.startedAt!,
    },
    attempt.questions,
    { resultId: `exam-result:${attempt.id}`, completedAt: now.toISOString() },
  );
  const completed: ExamAttempt = {
    ...attempt,
    status: isExamExpired(attempt, now) ? 'EXPIRED' : 'SUBMITTED',
    completedAt: result.completedAt,
    resultId: result.id,
  };
  const wrong = new Set(result.wrongQuestionIds);
  const reviewCommands = attempt.questions.map((question) => ({
    eventId: `${attempt.id}:question:${question.id}`,
    itemId: question.id,
    itemType: 'question' as const,
    correct: !wrong.has(question.id),
    confidence: wrong.has(question.id) ? (1 as const) : (3 as const),
    gradedAt: result.completedAt,
    onlyIfTracked: !wrong.has(question.id),
  }));
  return { attempt: completed, result, reviewCommands };
}

export function examBreakdown(attempt: ExamAttempt) {
  return ['quiz', 'reading', 'listening'].map((section) => {
    const questions = attempt.questions.filter((question) => question.section === section);
    return {
      section,
      total: questions.length,
      correct: questions.filter(
        (question) => attempt.answers[question.id] === question.correctIndex,
      ).length,
    };
  });
}
