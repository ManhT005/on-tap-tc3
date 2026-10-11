import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ProgressRepositoryProvider } from '../../../app/providers/ProgressRepositoryProvider';
import { MemoryProgressRepository } from '../../../repositories/memory-progress.repository';
import { VocabularyLab } from './VocabularyLab';

describe('vocabulary UI persistence', () => {
  it('retains an uncommitted card after quota error and commits its retry once', async () => {
    const repository = new MemoryProgressRepository();
    const mutate = vi
      .spyOn(repository, 'mutateVocabularySession')
      .mockRejectedValueOnce(new DOMException('Quota', 'QuotaExceededError'));
    render(
      <ProgressRepositoryProvider repository={repository}>
        <MemoryRouter initialEntries={['/vocabulary?lesson=1']}>
          <VocabularyLab lessonId={1} />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );
    await screen.findByRole('button', { name: 'Hiện nghĩa' });
    expect(screen.queryByText('Học kỳ', { exact: true })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Hiện nghĩa' }));
    const grade = screen.getByRole('button', { name: '4 · Rất chắc' });
    fireEvent.click(grade);
    await screen.findByRole('alert');
    expect(await repository.getReviewItems()).toHaveLength(0);
    expect((await repository.getVocabularySession(1))?.grades).toEqual({});
    fireEvent.click(grade);
    fireEvent.click(grade);
    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(2));
    await waitFor(async () => expect((await repository.getReviewItems())[0]?.repetitions).toBe(1));
  });
  it('opens a requested stable word even when a different batch already exists', async () => {
    const repository = new MemoryProgressRepository();
    const now = new Date().toISOString();
    await repository.startVocabularySession({
      id: 'previous',
      lessonId: 1,
      itemIds: ['vocab-01-0001'],
      batchSize: 5,
      cursor: 0,
      grades: {},
      startedAt: now,
      updatedAt: now,
    });
    render(
      <ProgressRepositoryProvider repository={repository}>
        <MemoryRouter initialEntries={['/vocabulary?lesson=1&word=vocab-01-0016']}>
          <VocabularyLab lessonId={1} />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );
    expect(await screen.findByRole('heading', { name: '등록금' })).toBeInTheDocument();
    expect((await repository.getVocabularySession(1))?.itemIds).toEqual(['vocab-01-0016']);
    expect(await repository.getReviewItems()).toHaveLength(0);
  });
});
