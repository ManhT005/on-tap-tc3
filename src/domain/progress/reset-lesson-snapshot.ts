import { getLearningRequirements } from '../learning/learning-manifest';
import { resolveContentItemId } from '../review/content-identity';
import type { ProgressSnapshot } from './backup';

export function resetLessonSnapshot(
  snapshot: ProgressSnapshot,
  lessonId: number,
): ProgressSnapshot {
  const lesson = getLearningRequirements(lessonId);
  const ids = new Set([...lesson.vocabularyIds, ...lesson.grammarIds, ...lesson.questionIds]);
  const results = snapshot.results.filter((result) => result.lessonId !== lessonId);
  const resultIds = new Set(results.map((result) => result.id));
  return {
    ...snapshot,
    lessons: snapshot.lessons.filter((item) => item.lessonId !== lessonId),
    reviewItems: snapshot.reviewItems.filter((item) => !ids.has(resolveContentItemId(item.itemId))),
    results,
    receipts: snapshot.receipts.filter((receipt) => resultIds.has(receipt.resultId)),
    settings: snapshot.settings.filter((setting) => {
      if (setting.key === `vocabulary-session:${lessonId}`) return false;
      if (setting.key.startsWith(`writing-draft:${lessonId}:`)) return false;
      if (
        setting.key.startsWith('review-event:') &&
        setting.value &&
        typeof setting.value === 'object' &&
        'itemId' in setting.value &&
        typeof setting.value.itemId === 'string'
      )
        return !ids.has(resolveContentItemId(setting.value.itemId));
      return true;
    }),
  };
}
