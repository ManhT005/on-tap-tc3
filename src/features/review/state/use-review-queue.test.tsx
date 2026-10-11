import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgressRepositoryProvider } from '../../../app/providers/ProgressRepositoryProvider';
import { ReviewPage } from '../../../pages/ReviewPage';
import { MemoryProgressRepository } from '../../../repositories/memory-progress.repository';
import { createReviewStatus } from '../../../domain/review/review-engine';

afterEach(() => vi.useRealTimers());

describe('live review queue', () => {
  it('discovers items whose due time passes without navigating and cleans up its timer', async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date('2026-10-11T00:00:00.000Z'));
    const repo = new MemoryProgressRepository();
    await repo.saveReviewItem({
      ...createReviewStatus('101', 'question', new Date()),
      nextReviewAt: '2026-10-11T00:00:20.000Z',
    });
    const view = render(
      <ProgressRepositoryProvider repository={repo}>
        <ReviewPage />
      </ProgressRepositoryProvider>,
    );
    expect(await screen.findByText('Bạn đã ôn hết mục đến hạn')).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    expect(screen.getByRole('heading', { name: /Chọn câu ĐÚNG ngữ pháp/ })).toBeInTheDocument();
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('refreshes after focus with changes made by another tab', async () => {
    const repo = new MemoryProgressRepository();
    render(
      <ProgressRepositoryProvider repository={repo}>
        <ReviewPage />
      </ProgressRepositoryProvider>,
    );
    expect(await screen.findByText('Bạn đã ôn hết mục đến hạn')).toBeInTheDocument();
    await repo.saveReviewItem(createReviewStatus('101', 'question', new Date()));
    await act(async () => window.dispatchEvent(new Event('focus')));
    expect(screen.getByRole('heading', { name: /Chọn câu ĐÚNG ngữ pháp/ })).toBeInTheDocument();
  });
});
