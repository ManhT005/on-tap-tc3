import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReviewQueueItem } from './ReviewQueueItem';

const item = {
  itemId: '101',
  itemType: 'question' as const,
  repetitions: 1,
  correctCount: 0,
  wrongCount: 1,
  lastReviewedAt: '2026-10-01T08:00:00.000Z',
  nextReviewAt: '2026-10-01T08:10:00.000Z',
  intervalDays: 0,
  confidence: 1 as const,
  box: 0,
};

describe('ReviewQueueItem', () => {
  it('requires reveal and confidence before saving a review grade', () => {
    const onGrade = vi.fn();
    render(
      <ReviewQueueItem
        item={item}
        content={{ prompt: 'Câu hỏi', answer: 'Đáp án đúng' }}
        onGrade={onGrade}
      />,
    );

    expect(screen.getByRole('button', { name: 'Lưu kết quả ôn' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Hiện đáp án' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByRole('button', { name: 'Lưu kết quả ôn' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Lưu kết quả ôn' }));

    expect(onGrade).toHaveBeenCalledWith(3);
  });
});
