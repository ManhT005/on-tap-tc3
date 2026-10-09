import { z } from 'zod';

export const ReviewStatusSchema = z.object({
  itemId: z.string(),
  itemType: z.enum(['vocabulary', 'grammar', 'question']),
  repetitions: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  wrongCount: z.number().int().min(0),
  lastReviewedAt: z.string().datetime(),
  /** BUG-P2-011: Timestamp of the most recent wrong answer. Optional for backward compat. */
  lastWrongAt: z.string().datetime().optional(),
  nextReviewAt: z.string().datetime(),
  intervalDays: z.number().min(0),
  confidence: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  box: z.number().int().min(0).max(5),
});

export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;
