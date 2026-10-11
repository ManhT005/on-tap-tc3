import { LESSONS_DATA } from '../../data/lessons';
import { QUIZ_BANK } from '../../data/quiz-bank';
import { READING_BANK } from '../../data/reading-bank';
import { resolveContentItemId } from '../review/content-identity';
import type { ProgressSnapshot } from './backup';

export function resetLessonSnapshot(
  snapshot: ProgressSnapshot,
  lessonId: number,
): ProgressSnapshot {
  const lesson = LESSONS_DATA[lessonId];
  if (!lesson) throw new Error('Lesson does not exist.');
  const ids = new Set([
    ...lesson.vocabulary.flatMap((pack) => pack.items.map((item) => item.id!)),
    ...lesson.grammar.map((item) => item.id!),
    ...QUIZ_BANK.filter((question) => question.lessonId === lessonId).map((question) =>
      String(question.id),
    ),
    ...(READING_BANK[String(lessonId)] ?? []).flatMap((passage) =>
      passage.questions.map((question) => question.id),
    ),
  ]);
  const results = snapshot.results.filter((result) => result.lessonId !== lessonId);
  const resultIds = new Set(results.map((result) => result.id));
  return {
    ...snapshot,
    lessons: snapshot.lessons.filter((item) => item.lessonId !== lessonId),
    reviewItems: snapshot.reviewItems.filter((item) => !ids.has(resolveContentItemId(item.itemId))),
    results,
    receipts: snapshot.receipts.filter((receipt) => resultIds.has(receipt.resultId)),
    settings: snapshot.settings.filter((setting) => {
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
