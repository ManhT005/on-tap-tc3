import { z } from 'zod';
import { ReviewStatusSchema } from '../../data/schemas';
import { resolveContentItemId } from '../review/content-identity';

const timestamp = z.string().datetime();
const ids = z.array(z.string().min(1)).max(5000);
const LessonProgressSchema = z.object({
  lessonId: z.number().int().min(1).max(15),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'NEEDS_REVIEW']),
  completionPercent: z.number().min(0).max(100).optional(),
  startedAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp.optional(),
  legacyCompletedAt: timestamp.optional(),
  steps: z
    .object({
      recallIds: ids,
      vocabularyIds: ids,
      grammarIds: ids,
      quickQuizCompleted: z.boolean(),
    })
    .optional(),
});
export const PracticeResultSchema = z
  .object({
    id: z.string().min(1),
    sessionId: z.string().min(1).optional(),
    contentVersion: z.string().optional(),
    lessonId: z.number().int().min(1).max(15).optional(),
    mode: z.enum(['lesson', 'quiz', 'reading', 'writing', 'listening', 'exam']),
    assessmentType: z.enum(['AUTO_GRADED', 'SELF_ASSESSED']).optional(),
    score: z.number().min(0).max(100),
    correct: z.number().int().nonnegative(),
    wrong: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    wrongQuestionIds: ids,
    answers: z.record(z.string(), z.unknown()),
    responses: z.record(z.string(), z.string()).optional(),
    questionSnapshots: z
      .array(
        z.object({
          id: z.string(),
          question: z.string(),
          options: z.array(z.string()),
          correctIndex: z.number().int(),
          explanation: z.string().optional(),
          evidence: z.string().optional(),
        }),
      )
      .optional(),
    startedAt: timestamp,
    completedAt: timestamp,
  })
  .refine(
    (result) => result.correct + result.wrong === result.total,
    'Result counters do not add up',
  );

export const ProgressSnapshotSchema = z.object({
  lessons: z.array(LessonProgressSchema).max(15),
  reviewItems: z.array(ReviewStatusSchema).max(50_000),
  results: z.array(PracticeResultSchema).max(50_000),
  receipts: z
    .array(
      z.object({
        sessionId: z.string().min(1),
        resultId: z.string().min(1),
        completedAt: timestamp,
      }),
    )
    .max(50_000)
    .default([]),
  settings: z
    .array(z.object({ key: z.string().min(1), value: z.unknown(), updatedAt: timestamp }))
    .max(100_000)
    .default([]),
});
export type ProgressSnapshot = z.infer<typeof ProgressSnapshotSchema>;
export type WritingDraft = {
  lessonId: number;
  promptId: string;
  response: string;
  updatedAt: string;
};
export const WritingDraftSchema = z.object({
  lessonId: z.number().int().min(1).max(15),
  promptId: z.string().min(1),
  response: z.string().max(100_000),
  updatedAt: timestamp,
});
export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;

export function validateSnapshot(input: unknown): ProgressSnapshot {
  const snapshot = ProgressSnapshotSchema.parse(input);
  function unique(keys: string[], kind: string) {
    if (new Set(keys).size !== keys.length) throw new Error(`Duplicate ${kind} in backup.`);
  }
  unique(
    snapshot.lessons.map((item) => String(item.lessonId)),
    'lesson',
  );
  unique(
    snapshot.reviewItems.map((item) => `${item.itemType}:${item.itemId}`),
    'review item',
  );
  unique(
    snapshot.results.map((item) => item.id),
    'result',
  );
  unique(
    snapshot.results.flatMap((item) => (item.sessionId ? [item.sessionId] : [])),
    'session',
  );
  unique(
    snapshot.receipts.map((item) => item.sessionId),
    'receipt',
  );
  unique(
    snapshot.settings.map((item) => item.key),
    'setting',
  );
  for (const receipt of snapshot.receipts) {
    const result = snapshot.results.find((item) => item.id === receipt.resultId);
    if (
      !result ||
      (result.sessionId && result.sessionId !== receipt.sessionId) ||
      result.completedAt !== receipt.completedAt
    ) {
      throw new Error('Receipt references an inconsistent result.');
    }
  }
  for (const setting of snapshot.settings) {
    if (setting.key.startsWith('writing-draft:')) WritingDraftSchema.parse(setting.value);
    if (setting.key.startsWith('review-event:')) ReviewStatusSchema.parse(setting.value);
  }
  return snapshot;
}

export function normalizeSnapshot(input: unknown): ProgressSnapshot {
  const snapshot = validateSnapshot(input);
  const reviews = new Map<string, ProgressSnapshot['reviewItems'][number]>();
  for (const item of snapshot.reviewItems) {
    const updated = {
      ...item,
      itemId: item.itemType === 'question' ? item.itemId : resolveContentItemId(item.itemId),
    };
    const key = `${updated.itemType}:${updated.itemId}`;
    const collision = reviews.get(key);
    if (collision) {
      snapshot.settings.push({
        key: `import-collision:${item.itemType}:${item.itemId}`,
        value: { legacy: item, canonical: collision },
        updatedAt: item.lastReviewedAt,
      });
    }
    if (!collision || updated.repetitions > collision.repetitions) reviews.set(key, updated);
  }
  return validateSnapshot({ ...snapshot, reviewItems: [...reviews.values()] });
}

export function createBackup(snapshot: ProgressSnapshot, exportedAt = new Date().toISOString()) {
  return {
    app: 'on-tap-tc3' as const,
    schemaVersion: 3 as const,
    exportedAt,
    data: validateSnapshot(snapshot),
  };
}

export function snapshotFingerprint(input: ProgressSnapshot): string {
  const snapshot = validateSnapshot(input);
  const ordered = {
    ...snapshot,
    lessons: [...snapshot.lessons].sort((a, b) => a.lessonId - b.lessonId),
    reviewItems: [...snapshot.reviewItems].sort((a, b) =>
      `${a.itemType}:${a.itemId}`.localeCompare(`${b.itemType}:${b.itemId}`),
    ),
    results: [...snapshot.results].sort((a, b) => a.id.localeCompare(b.id)),
    receipts: [...snapshot.receipts].sort((a, b) => a.sessionId.localeCompare(b.sessionId)),
    settings: [...snapshot.settings].sort((a, b) => a.key.localeCompare(b.key)),
  };
  function canonical(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object')
      return Object.fromEntries(
        Object.entries(value)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, entry]) => [key, canonical(entry)]),
      );
    return value;
  }
  return JSON.stringify(canonical(ordered));
}

export function parseBackup(text: string) {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES)
    throw new Error('Backup exceeds 10 MiB.');
  const envelope = z
    .object({
      app: z.literal('on-tap-tc3'),
      schemaVersion: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      exportedAt: timestamp,
      data: z.unknown(),
    })
    .parse(JSON.parse(text));
  return normalizeSnapshot(envelope.data);
}
