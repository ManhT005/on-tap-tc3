import { z } from 'zod';
import { ExampleSchema } from './vocabulary.schema';

export const GrammarItemSchema = z.object({
  id: z.string(),
  lessonId: z.number().int(),
  structure: z.string().min(1),
  meaning: z.string().min(1),
  rule: z.string().min(1),
  restrictions: z.array(z.string()).optional(),
  commonMistakes: z.array(z.string()).optional(),
  confusionWith: z.array(z.string()).optional(),
  examples: z.array(ExampleSchema).min(2),
  drills: z.array(z.string()).min(1),
  sourceRef: z.string().optional(),
  sourceType: z.enum(['course', 'adapted', 'authored']),
});

export const LegacyGrammarItemSchema = z
  .object({
    structure: z.string().min(1),
    meaning: z.string().min(1),
    rule: z.string().min(1),
    examples: z.array(ExampleSchema).min(1),
  })
  .passthrough();

export type GrammarItem = z.infer<typeof GrammarItemSchema>;
