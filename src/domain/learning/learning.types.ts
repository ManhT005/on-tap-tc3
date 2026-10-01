import type { LegacyCourseEntry, LessonContent } from '../../data/schemas';
import type { QUIZ_BANK } from '../../data/quiz-bank';
import type { READING_BANK } from '../../data/reading-bank';

export type LessonDetails = LegacyCourseEntry & LessonContent;
export type LearningLessonSummary = LegacyCourseEntry & {
  objectives: string;
  vocabularyCount: number;
  grammarCount: number;
};
export type LessonVocabulary = LessonContent['vocabulary'];
export type LessonGrammar = LessonContent['grammar'];
export type LessonQuiz = (typeof QUIZ_BANK)[number];
export type LessonReading = (typeof READING_BANK)[string][number];

export type LearningError = {
  code: 'LESSON_NOT_FOUND' | 'LESSON_CONTENT_NOT_FOUND';
  message: string;
};

export type LearningResult<T> = { ok: true; data: T } | { ok: false; error: LearningError };
