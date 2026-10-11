import { z } from 'zod';
import { getLearningRequirements } from '../learning/learning-manifest';
import type { ReviewCommand } from '../review/review-command';

export const VocabularySessionSchema = z
  .object({
    id: z.string().min(1),
    lessonId: z.number().int().min(1).max(15),
    itemIds: z.array(z.string().min(1)).min(1).max(15),
    batchSize: z.union([z.literal(5), z.literal(10), z.literal(15)]),
    cursor: z.number().int().nonnegative(),
    grades: z.record(z.string(), z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])),
    startedAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .superRefine((session, ctx) => {
    const allowed = new Set(getLearningRequirements(session.lessonId).vocabularyIds);
    if (
      session.cursor >= session.itemIds.length ||
      session.itemIds.length > session.batchSize ||
      new Set(session.itemIds).size !== session.itemIds.length ||
      session.itemIds.some((id) => !allowed.has(id)) ||
      Object.keys(session.grades).some((id) => !session.itemIds.includes(id))
    ) {
      ctx.addIssue({ code: 'custom', message: 'Invalid vocabulary session identity or cursor.' });
    }
  });
export type VocabularySession = z.infer<typeof VocabularySessionSchema>;
export type VocabularyMutation = { sessionId: string; lessonId: number; occurredAt: string } & (
  { kind: 'move'; cursor: number } | { kind: 'grade'; itemId: string; confidence: 1 | 2 | 3 | 4 }
);

export function mutateVocabularySession(
  input: VocabularySession,
  mutation: VocabularyMutation,
): { session: VocabularySession; command?: ReviewCommand } {
  const current = VocabularySessionSchema.parse(input);
  if (current.id !== mutation.sessionId || current.lessonId !== mutation.lessonId)
    throw new Error('Vocabulary session changed in another tab.');
  if (!Number.isFinite(new Date(mutation.occurredAt).getTime()))
    throw new Error('Invalid event time.');
  if (mutation.kind === 'move')
    return {
      session: VocabularySessionSchema.parse({
        ...current,
        cursor: mutation.cursor,
        updatedAt: mutation.occurredAt,
      }),
    };
  if (!current.itemIds.includes(mutation.itemId) || ![1, 2, 3, 4].includes(mutation.confidence))
    throw new Error('Unknown grade item.');
  if (current.grades[mutation.itemId]) return { session: current };
  const requirements = getLearningRequirements(current.lessonId);
  const next = current.itemIds.findIndex((id) => id !== mutation.itemId && !current.grades[id]);
  const session = VocabularySessionSchema.parse({
    ...current,
    grades: { ...current.grades, [mutation.itemId]: mutation.confidence },
    cursor: next === -1 ? current.cursor : next,
    updatedAt: mutation.occurredAt,
  });
  return {
    session,
    command: {
      eventId: `vocabulary:${current.id}:${mutation.itemId}`,
      itemId: mutation.itemId,
      itemType: 'vocabulary',
      kind: 'grade',
      confidence: mutation.confidence,
      correct: mutation.confidence >= 3,
      gradedAt: mutation.occurredAt,
      lessonEvent: {
        lessonId: current.lessonId,
        itemId: mutation.itemId,
        kind: requirements.recallIds.includes(mutation.itemId) ? 'recall' : 'vocabulary',
        occurredAt: mutation.occurredAt,
      },
    },
  };
}
