import { getLearningRequirements } from '../learning/learning-manifest';
import type { LessonProgress, LessonSteps } from './progress.types';

export type LessonEvent = {
  lessonId: number;
  kind: 'opened' | 'recall' | 'vocabulary' | 'grammar' | 'quiz';
  itemId?: string;
  occurredAt: string;
};

export function getLessonRequirements(lessonId: number) {
  return getLearningRequirements(lessonId);
}

export function emptyLessonSteps(): LessonSteps {
  return { recallIds: [], vocabularyIds: [], grammarIds: [], quickQuizCompleted: false };
}

/** Recall 20%, vocabulary 40%, grammar 20%, submitted quiz 20%. */
export function calculateLessonProgress(lessonId: number, steps: LessonSteps) {
  const required = getLessonRequirements(lessonId);
  const fraction = (ids: string[], expected: string[]) =>
    expected.length === 0 ? 1 : expected.filter((id) => ids.includes(id)).length / expected.length;
  const recall = fraction(steps.recallIds, required.recallIds);
  const vocabulary = fraction(steps.vocabularyIds, required.vocabularyIds);
  const grammar = fraction(steps.grammarIds, required.grammarIds);
  const completed = recall === 1 && vocabulary === 1 && grammar === 1 && steps.quickQuizCompleted;
  const percent = Math.floor(
    20 * recall + 40 * vocabulary + 20 * grammar + (steps.quickQuizCompleted ? 20 : 0),
  );
  return { completed, completionPercent: completed ? 100 : Math.min(99, percent) };
}

export function applyLessonEvent(
  current: LessonProgress | null | undefined,
  event: LessonEvent,
): LessonProgress {
  if (!Number.isFinite(new Date(event.occurredAt).getTime()))
    throw new Error('Invalid lesson event time.');
  const required = getLessonRequirements(event.lessonId);
  const steps = structuredClone(current?.steps ?? emptyLessonSteps());
  if (event.kind === 'quiz') steps.quickQuizCompleted = true;
  if (event.kind === 'recall' || event.kind === 'vocabulary' || event.kind === 'grammar') {
    const key =
      event.kind === 'recall'
        ? 'recallIds'
        : event.kind === 'vocabulary'
          ? 'vocabularyIds'
          : 'grammarIds';
    if (!event.itemId || !required[key].includes(event.itemId))
      throw new Error('Unknown lesson step item.');
    steps[key] = [...new Set([...steps[key], event.itemId])];
    if (event.kind === 'recall')
      steps.vocabularyIds = [...new Set([...steps.vocabularyIds, event.itemId])];
  }
  const calculated = calculateLessonProgress(event.lessonId, steps);
  return {
    lessonId: event.lessonId,
    steps,
    ...(current?.legacyCompletedAt || (!current?.steps && current?.status === 'COMPLETED')
      ? { legacyCompletedAt: current.legacyCompletedAt ?? current.completedAt ?? current.updatedAt }
      : {}),
    status: calculated.completed ? 'COMPLETED' : 'IN_PROGRESS',
    completionPercent: calculated.completionPercent,
    startedAt: current?.startedAt ?? event.occurredAt,
    updatedAt:
      event.occurredAt > (current?.updatedAt ?? '') ? event.occurredAt : current!.updatedAt,
    ...(calculated.completed ? { completedAt: current?.completedAt ?? event.occurredAt } : {}),
  };
}
