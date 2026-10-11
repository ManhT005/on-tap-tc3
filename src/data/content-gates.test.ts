import { describe, expect, it } from 'vitest';
import { LegacyQuizItemSchema, LegacyReadingQuestionSchema } from './schemas';
import { QUIZ_BANK } from './quiz-bank';
import { READING_BANK } from './reading-bank';
import { WRITING_BANK } from './writing-bank';

describe('content release structure', () => {
  it.each([2, 5])('rejects a quiz with %i options', (count) => {
    expect(
      LegacyQuizItemSchema.safeParse({
        ...QUIZ_BANK[0],
        options: Array.from({ length: count }, (_, i) => `Option ${i}`),
      }).success,
    ).toBe(false);
  });
  it('rejects blank/duplicate options, invalid answer indexes and missing reading evidence', () => {
    for (const options of [
      ['a', 'a', 'b', 'c'],
      ['a', ' ', 'b', 'c'],
    ])
      expect(LegacyQuizItemSchema.safeParse({ ...QUIZ_BANK[0], options }).success).toBe(false);
    expect(LegacyQuizItemSchema.safeParse({ ...QUIZ_BANK[0], correctIndex: 4 }).success).toBe(
      false,
    );
    expect(
      LegacyReadingQuestionSchema.safeParse({
        id: 'invalid',
        question: 'Question',
        options: ['a', 'b', 'c', 'd'],
        correctIndex: 0,
      }).success,
    ).toBe(false);
  });
  it('covers every lesson with twelve quiz questions and two reading/writing activities', () => {
    for (let lessonId = 1; lessonId <= 15; lessonId++) {
      expect(QUIZ_BANK.filter((question) => question.lessonId === lessonId)).toHaveLength(12);
      expect(READING_BANK[String(lessonId)]!.length).toBeGreaterThanOrEqual(2);
      expect(
        WRITING_BANK.filter((prompt) => prompt.lessonId === lessonId).length,
      ).toBeGreaterThanOrEqual(2);
    }
  });
});
