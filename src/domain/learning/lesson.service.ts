import { COURSE_STRUCTURE } from '../../data/course';
import { LESSONS_DATA } from '../../data/lessons';
import { QUIZ_BANK } from '../../data/quiz-bank';
import { READING_BANK } from '../../data/reading-bank';
import type {
  LearningError,
  LearningResult,
  LessonDetails,
  LessonGrammar,
  LessonQuiz,
  LessonReading,
  LessonVocabulary,
} from './learning.types';

function failure(code: LearningError['code'], message: string): LearningResult<never> {
  return { ok: false, error: { code, message } };
}

export function getLessonById(id: number): LearningResult<LessonDetails> {
  const summary = COURSE_STRUCTURE.find((lesson) => lesson.id === id);

  if (!summary) {
    return failure('LESSON_NOT_FOUND', `Không tìm thấy bài học với ID ${id}.`);
  }

  const content = LESSONS_DATA[id];
  if (!content) {
    return failure('LESSON_CONTENT_NOT_FOUND', `Nội dung bài học ${id} chưa sẵn sàng.`);
  }

  return { ok: true, data: { ...summary, ...content } };
}

export function getLessonVocabulary(id: number): LearningResult<LessonVocabulary> {
  const lesson = getLessonById(id);
  return lesson.ok ? { ok: true, data: lesson.data.vocabulary } : lesson;
}

export function getLessonGrammar(id: number): LearningResult<LessonGrammar> {
  const lesson = getLessonById(id);
  return lesson.ok ? { ok: true, data: lesson.data.grammar } : lesson;
}

export function getLessonQuiz(id: number): LearningResult<LessonQuiz[]> {
  const lesson = getLessonById(id);
  return lesson.ok
    ? { ok: true, data: QUIZ_BANK.filter((question) => question.lessonId === id) }
    : lesson;
}

export function getLessonReading(id: number): LearningResult<LessonReading[]> {
  const lesson = getLessonById(id);
  return lesson.ok ? { ok: true, data: READING_BANK[String(id)] ?? [] } : lesson;
}
