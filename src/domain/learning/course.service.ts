import { COURSE_STRUCTURE } from '../../data/course';
import { LESSONS_DATA } from '../../data/lessons';
import type { LearningLessonSummary } from './learning.types';

export function getLessons(): LearningLessonSummary[] {
  return COURSE_STRUCTURE.map((lesson) => {
    const content = LESSONS_DATA[lesson.id];

    return {
      ...lesson,
      ...(content
        ? {
            title: content.title,
            objectives: content.objectives,
            vocabularyCount: content.vocabulary.reduce(
              (count, pack) => count + pack.items.length,
              0,
            ),
            grammarCount: content.grammar.length,
          }
        : { objectives: '', vocabularyCount: 0, grammarCount: 0 }),
    };
  });
}
