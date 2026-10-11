import { z } from 'zod';
import { MultipleChoiceOptionsSchema } from '../../data/schemas/mcq.schema';
import { ListeningPassageSchema } from '../../data/schemas/listening.schema';

export const ExamBlueprintSchema = z
  .object({
    id: z.string().min(1),
    version: z.number().int().positive(),
    timed: z.boolean(),
    durationMinutes: z.number().positive(),
    sections: z.object({
      quiz: z.number().int().nonnegative(),
      reading: z.number().int().nonnegative(),
      listening: z.number().int().nonnegative(),
    }),
  })
  .refine(
    (blueprint) => Object.values(blueprint.sections).reduce((sum, count) => sum + count, 0) > 0,
    'Exam cannot be empty',
  );
export const ExamQuestionSchema = z.object({
  id: z.string().min(1),
  lessonId: z.number().int().min(1).max(15),
  section: z.enum(['quiz', 'reading', 'listening']),
  question: z.string().min(1),
  options: MultipleChoiceOptionsSchema,
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
  context: z.string().optional(),
  listening: ListeningPassageSchema.optional(),
});
export const ExamAttemptSchema = z
  .object({
    id: z.string().min(1),
    blueprint: ExamBlueprintSchema,
    seed: z.string().min(1),
    status: z.enum(['CREATED', 'IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'ABANDONED']),
    questions: z.array(ExamQuestionSchema).min(1).max(200),
    answers: z.record(z.string(), z.number().int().min(0).max(3)),
    flaggedIds: z.array(z.string()),
    createdAt: z.string().datetime(),
    startedAt: z.string().datetime().optional(),
    deadlineAt: z.string().datetime().optional(),
    completedAt: z.string().datetime().optional(),
    resultId: z.string().optional(),
  })
  .superRefine((attempt, context) => {
    const ids = new Set(attempt.questions.map((question) => question.id));
    const fail = (message: string) => context.addIssue({ code: 'custom', message });
    if (ids.size !== attempt.questions.length) fail('Duplicate exam question');
    if (
      Object.keys(attempt.answers).some((id) => !ids.has(id)) ||
      attempt.flaggedIds.some((id) => !ids.has(id))
    )
      fail('Unknown exam answer or flag');
    for (const section of ['quiz', 'reading', 'listening'] as const) {
      if (
        attempt.questions.filter((question) => question.section === section).length !==
        attempt.blueprint.sections[section]
      )
        fail('Blueprint section count mismatch');
    }
    if (attempt.status !== 'CREATED' && !attempt.startedAt) fail('Started exam has no start time');
    if (
      attempt.status !== 'CREATED' &&
      attempt.blueprint.timed &&
      (!attempt.deadlineAt ||
        Date.parse(attempt.deadlineAt) !==
          Date.parse(attempt.startedAt ?? '') + attempt.blueprint.durationMinutes * 60_000)
    )
      fail('Exam deadline must match its immutable start time');
    if (
      (attempt.status === 'SUBMITTED' || attempt.status === 'EXPIRED') &&
      (!attempt.resultId || !attempt.completedAt)
    )
      fail('Completed exam has no result receipt');
  });
export type ExamBlueprint = z.infer<typeof ExamBlueprintSchema>;
export type ExamQuestion = z.infer<typeof ExamQuestionSchema>;
export type ExamAttempt = z.infer<typeof ExamAttemptSchema>;
export type ExamMutation =
  | { attemptId: string; kind: 'answer'; questionId: string; answer: number }
  | { attemptId: string; kind: 'flag'; questionId: string }
  | { attemptId: string; kind: 'abandon' };
