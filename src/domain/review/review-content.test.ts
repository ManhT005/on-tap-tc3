import { describe, expect, it } from 'vitest';
import { ReviewStatusSchema } from '../../data/schemas';
import { getReviewPrompt } from './review-content';

function createItem(itemType: 'vocabulary' | 'grammar' | 'question', itemId: string) {
  return ReviewStatusSchema.parse({
    itemId,
    itemType,
    repetitions: 0,
    correctCount: 0,
    wrongCount: 1,
    lastReviewedAt: '2026-10-01T08:00:00.000Z',
    nextReviewAt: '2026-10-01T08:10:00.000Z',
    intervalDays: 0,
    confidence: 1,
    box: 0,
  });
}

describe('getReviewPrompt', () => {
  it('resolves lesson vocabulary from its stable review ID', () => {
    expect(getReviewPrompt(createItem('vocabulary', 'lesson-1-vocabulary-0-0'))).toMatchObject({
      prompt: '학기',
      answer: 'Học kỳ',
    });
  });

  it('resolves grammar content from its review ID', () => {
    expect(getReviewPrompt(createItem('grammar', 'lesson-1-grammar-0'))?.prompt).toBe(
      'Danh từ + 밖에',
    );
  });

  it('resolves quiz questions by question ID', () => {
    expect(getReviewPrompt(createItem('question', '101'))?.prompt).toContain('밖에');
  });

  it('resolves reading questions by question ID', () => {
    expect(getReviewPrompt(createItem('question', 'rq_1_1_1'))?.prompt).toContain(
      'kéo dài bao lâu',
    );
  });

  it('resolves vocabulary from stable word-based review ID', () => {
    expect(
      getReviewPrompt(createItem('vocabulary', `lesson-1-vocab-${encodeURIComponent('학기')}`)),
    ).toMatchObject({
      prompt: '학기',
      answer: 'Học kỳ',
    });
  });

  it('resolves grammar from stable structure-based review ID', () => {
    expect(
      getReviewPrompt(
        createItem('grammar', `lesson-1-grammar-${encodeURIComponent('Danh từ + 밖에')}`),
      ),
    )?.toMatchObject({
      prompt: 'Danh từ + 밖에',
    });
  });

  it('returns null for stale or malformed references', () => {
    expect(getReviewPrompt(createItem('vocabulary', 'lesson-1-vocabulary-99-99'))).toBeNull();
    expect(getReviewPrompt(createItem('vocabulary', 'lesson-1-vocab-nonexistent-word'))).toBeNull();
  });
});
