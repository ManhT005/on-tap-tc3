import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ProgressRepositoryProvider } from '../app/providers/ProgressRepositoryProvider';
import type { ReviewStatus } from '../data/schemas';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { LessonProgress } from '../domain/progress/progress.types';
import { MemoryProgressRepository } from '../repositories/memory-progress.repository';
import { HomePage } from './HomePage';
import { ProgressPage } from './ProgressPage';

const now = new Date('2026-10-01T08:00:00.000Z');

async function createSeededRepository() {
  const repository = new MemoryProgressRepository(() => now);
  const lessons: LessonProgress[] = [
    {
      lessonId: 1,
      status: 'COMPLETED',
      startedAt: '2026-09-30T08:00:00.000Z',
      updatedAt: '2026-09-30T10:00:00.000Z',
      completedAt: '2026-09-30T10:00:00.000Z',
    },
    {
      lessonId: 2,
      status: 'IN_PROGRESS',
      startedAt: '2026-10-01T07:00:00.000Z',
      updatedAt: '2026-10-01T07:30:00.000Z',
    },
  ];
  const reviews: ReviewStatus[] = [
    {
      itemId: 'vocabulary-1',
      itemType: 'vocabulary',
      repetitions: 1,
      correctCount: 0,
      wrongCount: 1,
      lastReviewedAt: '2026-09-30T08:00:00.000Z',
      nextReviewAt: '2026-09-30T08:10:00.000Z',
      intervalDays: 0,
      confidence: 1,
      box: 0,
    },
    {
      itemId: 'grammar-1',
      itemType: 'grammar',
      repetitions: 1,
      correctCount: 1,
      wrongCount: 0,
      lastReviewedAt: '2026-09-30T08:00:00.000Z',
      nextReviewAt: '2026-09-30T08:10:00.000Z',
      intervalDays: 1,
      confidence: 3,
      box: 1,
    },
  ];
  const result: PracticeResult = {
    id: 'practice-1',
    lessonId: 1,
    mode: 'lesson',
    score: 75,
    correct: 3,
    wrong: 1,
    total: 4,
    wrongQuestionIds: ['q4'],
    answers: {},
    startedAt: '2026-09-30T09:00:00.000Z',
    completedAt: '2026-09-30T09:10:00.000Z',
  };

  await Promise.all(lessons.map((lesson) => repository.saveLessonProgress(lesson)));
  await Promise.all(reviews.map((item) => repository.saveReviewItem(item)));
  await repository.savePracticeResult(result);
  return repository;
}

describe('dashboard pages', () => {
  it('shows the in-progress lesson and real Home metrics', async () => {
    const repository = await createSeededRepository();
    render(
      <ProgressRepositoryProvider repository={repository}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );

    expect(await screen.findByRole('heading', { name: 'Bài 02' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tiếp tục học' })).toHaveAttribute('href', '/learn/2');
    expect(screen.getByText('Mục đến hạn hôm nay')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders persisted progress aggregates', async () => {
    const repository = await createSeededRepository();
    render(
      <ProgressRepositoryProvider repository={repository}>
        <MemoryRouter>
          <ProgressPage />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );

    expect(await screen.findByText('Bài đã hoàn thành')).toBeInTheDocument();
    expect(screen.getByText('Bài đang học')).toBeInTheDocument();
    expect(screen.getByText('Lượt luyện tập')).toBeInTheDocument();
    expect(screen.getByText('Từ vựng đã ôn')).toBeInTheDocument();
    expect(screen.getByText('Ngữ pháp đã ôn')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows a storage warning banner when storage is degraded', async () => {
    const repository = await createSeededRepository();
    render(
      <ProgressRepositoryProvider repository={repository} storageStatus="degraded">
        <MemoryRouter>
          <ProgressPage />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );

    expect(await screen.findByRole('status')).toHaveTextContent(/Bộ nhớ lâu dài không khả dụng/);
  });

  it('prioritizes error over loading skeleton when fetching progress fails', async () => {
    const failingRepo = {
      ...new MemoryProgressRepository(),
      getCourseProgress: vi.fn().mockRejectedValue(new Error('Fetch failed')),
      getLessonProgress: vi.fn().mockRejectedValue(new Error('Fetch failed')),
    };
    render(
      <ProgressRepositoryProvider repository={failingRepo}>
        <MemoryRouter>
          <ProgressPage />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được tiến độ học tập.');
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Đang tải tiến độ')).not.toBeInTheDocument();
  });
});
