import { z } from 'zod';
import { MultipleChoiceOptionsSchema } from './mcq.schema';

export const LegacyQuizItemSchema = z
  .object({
    id: z.number().int(),
    lessonId: z.number().int().min(1).max(15),
    type: z.string().min(1),
    question: z.string().min(1),
    options: MultipleChoiceOptionsSchema,
    skill: z.enum(['vocabulary', 'grammar', 'culture']).optional(),
    difficulty: z.number().int().min(1).max(3).optional(),
    targetIds: z.array(z.string().min(1)).optional(),
    correctIndex: z.number().int(),
    explanation: z.string().min(1),
    whyWrong: z.string().optional(),
    concept: z.string().optional(),
    keyword: z.string().optional(),
    source: z.string().optional(),
  })
  .refine(
    (question) => question.correctIndex >= 0 && question.correctIndex < question.options.length,
    {
      message: 'correctIndex must point to an existing option',
    },
  );

export const LegacyWritingPromptSchema = z.object({
  id: z.string().min(1),
  lessonId: z.number().int().min(1).max(15),
  title: z.string().min(1),
  prompt: z.string().min(1),
  requiredKeywords: z.array(z.string()),
  modelAnswer: z.string().min(1),
  explanation: z.string().min(1),
});

export const LegacyReadingQuestionSchema = z
  .object({
    id: z.string().min(1),
    question: z.string().min(1),
    options: MultipleChoiceOptionsSchema,
    correctIndex: z.number().int(),
    evidence: z.string().trim().min(1),
  })
  .refine(
    (question) => question.correctIndex >= 0 && question.correctIndex < question.options.length,
    {
      message: 'correctIndex must point to an existing option',
    },
  );

export const LegacyReadingPassageSchema = z.object({
  id: z.string().min(1),
  passageNumber: z.number().int().positive(),
  type: z.string().min(1),
  title: z.string().min(1),
  source: z.string().optional(),
  koreanText: z.string().min(1),
  vietnameseTranslation: z.string().optional(),
  keyVocabulary: z.array(z.object({ kr: z.string(), vn: z.string() })),
  questions: z.array(LegacyReadingQuestionSchema),
});

export const LegacyReadingDatabaseSchema = z.record(
  z.string(),
  z.array(LegacyReadingPassageSchema),
);
