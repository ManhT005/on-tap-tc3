import { describe, expect, it } from 'vitest';
import { getLessons } from './course.service';
import {
  getLessonById,
  getLessonGrammar,
  getLessonQuiz,
  getLessonReading,
  getLessonVocabulary,
} from './lesson.service';

describe('learning access layer', () => {
  it('lists all course lessons', () => {
    expect(getLessons()).toHaveLength(15);
  });

  it.each([1, 15])('loads lesson %i with its summary and content', (lessonId) => {
    const result = getLessonById(lessonId);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.id).toBe(lessonId);
    expect(result.data.koreanTitle).toBeTruthy();
    expect(result.data.vocabulary.length).toBeGreaterThan(0);
    expect(result.data.grammar.length).toBeGreaterThan(0);
  });

  it.each([0, 16, Number.NaN])('returns an explicit error for invalid lesson ID %s', (lessonId) => {
    expect(getLessonById(lessonId)).toMatchObject({
      ok: false,
      error: { code: 'LESSON_NOT_FOUND' },
    });
    expect(getLessonVocabulary(lessonId)).toMatchObject({ ok: false });
    expect(getLessonGrammar(lessonId)).toMatchObject({ ok: false });
    expect(getLessonQuiz(lessonId)).toMatchObject({ ok: false });
    expect(getLessonReading(lessonId)).toMatchObject({ ok: false });
  });

  it('returns lesson-scoped quiz and reading content', () => {
    const quiz = getLessonQuiz(1);
    const reading = getLessonReading(1);

    expect(quiz.ok && quiz.data.length).toBeGreaterThan(0);
    expect(reading.ok && reading.data.length).toBeGreaterThan(0);
  });
});
