import { z } from 'zod';
import { SourceTypeSchema } from './vocabulary.schema';

export const QuestionSchema = z
  .object({
    id: z.string(),
    lessonId: z.number().int(),
    skill: z.enum(['vocabulary', 'grammar', 'reading', 'listening', 'culture']),
    type: z.enum(['mcq', 'fill', 'matching', 'ordering', 'true-false']),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    prompt: z.string().min(1),
    options: z.array(z.string()).optional(),
    answer: z.union([z.string(), z.number(), z.boolean()]),
    explanation: z.string().min(1),
    evidence: z.string().optional(),
    targetIds: z.array(z.string()).min(1),
    sourceType: SourceTypeSchema,
  })
  .refine(
    (question) =>
      question.type !== 'mcq' ||
      (question.options !== undefined &&
        typeof question.answer === 'number' &&
        question.answer >= 0 &&
        question.answer < question.options.length),
    { message: 'MCQ must have options and a valid answer index' },
  );

export type Question = z.infer<typeof QuestionSchema>;
