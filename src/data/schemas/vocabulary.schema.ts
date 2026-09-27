import { z } from 'zod';

export const ExampleSchema = z.object({
  kr: z.string().min(1),
  vn: z.string().min(1),
});

export const SourceTypeSchema = z.enum(['course', 'adapted', 'authored']);

export const VocabularyItemSchema = z.object({
  id: z.string(),
  lessonId: z.number().int(),
  korean: z.string().min(1),
  vietnamese: z.string().min(1),
  partOfSpeech: z.string().optional(),
  source: z.enum(['basic', 'new-word', 'listening', 'supplemental']),
  category: z.string(),
  examples: z.array(ExampleSchema).min(1),
  collocations: z.array(z.string()).optional(),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
  confusionWith: z.array(z.string()).optional(),
  memoryHint: z.string().optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  tags: z.array(z.string()),
  sourceRef: z.string().optional(),
  sourceType: SourceTypeSchema,
});

export const LegacyVocabularyItemSchema = z.object({
  kr: z.string().min(1),
  vn: z.string().min(1),
  note: z.string().optional(),
});

export const VocabularyPackSchema = z.object({
  category: z.string().min(1),
  sourceTag: z.string().min(1),
  items: z.array(LegacyVocabularyItemSchema).min(1),
});

export type VocabularyItem = z.infer<typeof VocabularyItemSchema>;
export type VocabularyPack = z.infer<typeof VocabularyPackSchema>;
