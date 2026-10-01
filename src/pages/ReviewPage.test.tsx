import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProgressRepositoryProvider } from '../app/providers/ProgressRepositoryProvider';
import { MemoryProgressRepository } from '../repositories/memory-progress.repository';
import { ReviewPage } from './ReviewPage';

describe('ReviewPage', () => {
  it('removes a graded item from the due queue and persists its next review', async () => {
    const user = userEvent.setup();
    const now = new Date('2026-10-01T08:00:00.000Z');
    const repository = new MemoryProgressRepository(() => now);
    await repository.saveReviewItem({
      itemId: '101',
      itemType: 'question',
      repetitions: 1,
      correctCount: 0,
      wrongCount: 1,
      lastReviewedAt: '2026-10-01T07:50:00.000Z',
      nextReviewAt: now.toISOString(),
      intervalDays: 0,
      confidence: 1,
      box: 0,
    });

    render(
      <ProgressRepositoryProvider repository={repository}>
        <MemoryRouter>
          <ReviewPage />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );

    expect(
      await screen.findByRole('heading', { name: /chọn câu đúng ngữ pháp/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hiện đáp án' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: 'Lưu kết quả ôn' }));

    expect(await screen.findByText('Bạn đã ôn hết mục đến hạn')).toBeInTheDocument();
    await waitFor(async () => {
      const [updated] = await repository.getReviewItems();
      expect(updated).toMatchObject({ itemId: '101', confidence: 3, box: 1, intervalDays: 1 });
      expect(Date.parse(updated?.nextReviewAt ?? '')).toBeGreaterThan(Date.now());
    });
    expect(screen.getByText('1 lần sai')).toBeInTheDocument();
  });
});
