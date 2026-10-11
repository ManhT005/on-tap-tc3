import manifest from '../../data/learning-manifest.generated.json';
import type { ReviewStatus } from '../../data/schemas';
import { resolveContentItemId } from '../review/content-identity';

type Requirements = {
  recallIds: string[];
  vocabularyIds: string[];
  grammarIds: string[];
  questionIds: string[];
};
const lessons: Readonly<Record<number, Requirements>> = manifest;
const available = {
  vocabulary: new Set(Object.values(lessons).flatMap((lesson) => lesson.vocabularyIds)),
  grammar: new Set(Object.values(lessons).flatMap((lesson) => lesson.grammarIds)),
  question: new Set(Object.values(lessons).flatMap((lesson) => lesson.questionIds)),
};
export function getLearningRequirements(lessonId: number): Requirements {
  const requirements = lessons[lessonId];
  if (!requirements) throw new Error('Lesson does not exist.');
  return requirements;
}
export function isReviewItemAvailable(item: ReviewStatus) {
  return available[item.itemType].has(
    item.itemType === 'question' ? item.itemId : resolveContentItemId(item.itemId),
  );
}
