import { z } from 'zod';
import { LegacyGrammarItemSchema } from './grammar.schema';
import { VocabularyPackSchema } from './vocabulary.schema';

export const LessonMetaSchema = z.object({
  id: z.number().int().min(1).max(15),
  slug: z.string(),
  titleKr: z.string(),
  titleVi: z.string(),
  topic: z.string(),
  objectives: z.array(z.string()),
  importance: z.enum(['medium', 'high', 'very-high']),
  accentKey: z.string(),
  vocabularyIds: z.array(z.string()),
  grammarIds: z.array(z.string()),
  readingIds: z.array(z.string()),
  listeningIds: z.array(z.string()),
  writingIds: z.array(z.string()),
  cultureIds: z.array(z.string()),
});

export const LegacyCourseEntrySchema = z.object({
  id: z.number().int().min(1).max(15),
  title: z.string().min(1),
  koreanTitle: z.string().min(1),
  topic: z.string().min(1),
  importance: z.string().min(1),
  totalQuestions: z.number().int().positive(),
});

export const LessonContentSchema = z.object({
  title: z.string().min(1),
  koreanTitle: z.string().min(1),
  objectives: z.string().min(1),
  vocabulary: z.array(VocabularyPackSchema).min(1),
  grammar: z.array(LegacyGrammarItemSchema).min(1),
  culture: z.object({
    title: z.string().min(1),
    content: z.string().min(1),
  }),
});

export const LessonSchema = LessonMetaSchema;

export type Lesson = z.infer<typeof LessonSchema>;
export type LegacyCourseEntry = z.infer<typeof LegacyCourseEntrySchema>;
export type LessonContent = z.infer<typeof LessonContentSchema>;
