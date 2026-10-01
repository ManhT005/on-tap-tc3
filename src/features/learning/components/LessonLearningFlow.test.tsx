import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProgressRepositoryProvider } from '../../../app/providers/ProgressRepositoryProvider';
import { getLessonQuiz } from '../../../domain/learning/lesson.service';
import { MemoryProgressRepository } from '../../../repositories/memory-progress.repository';
import { LessonLearningFlow } from './LessonLearningFlow';

describe('LessonLearningFlow', () => {
  it('persists completion and queues incorrect practice answers', async () => {
    const user = userEvent.setup();
    const repository = new MemoryProgressRepository(() => new Date('2026-10-01T08:00:00.000Z'));
    const quizResult = getLessonQuiz(1);
    if (!quizResult.ok) throw new Error('Expected lesson 1 quiz data.');

    render(
      <ProgressRepositoryProvider repository={repository}>
        <MemoryRouter>
          <LessonLearningFlow lessonId={1} />
        </MemoryRouter>
      </ProgressRepositoryProvider>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Nhớ lại trước khi xem' }),
    ).toBeInTheDocument();
    await waitFor(async () => {
      await expect(repository.getLessonProgress(1)).resolves.toMatchObject({
        status: 'IN_PROGRESS',
      });
    });

    const revealButton = screen.getAllByRole('button', { name: 'Hiện nghĩa' })[0];
    if (!revealButton) throw new Error('Expected a recall reveal button.');
    await user.click(revealButton);
    const confidenceButton = screen.getAllByRole('button', { name: /4 · Rất chắc/ })[0];
    if (!confidenceButton)
      throw new Error('Expected a confidence button after revealing the card.');
    await user.click(confidenceButton);

    for (const question of quizResult.data) {
      const group = screen.getByRole('group', { name: `Đáp án cho câu ${question.id}` });
      const options = within(group).getAllByRole('button');
      const wrongIndex = (question.correctIndex + 1) % options.length;
      const wrongOption = options[wrongIndex];
      if (!wrongOption) throw new Error('Expected a wrong answer option.');
      await user.click(wrongOption);
    }

    await user.click(screen.getByRole('button', { name: 'Hoàn thành bài học' }));
    expect(
      await screen.findByRole('heading', { name: 'Bài luyện tập đã hoàn thành' }),
    ).toBeInTheDocument();
    await waitFor(async () => {
      await expect(repository.getLessonProgress(1)).resolves.toMatchObject({
        status: 'COMPLETED',
        completionPercent: 100,
      });
    });

    const reviewItems = await repository.getReviewItems();
    expect(reviewItems.some((item) => item.itemType === 'question')).toBe(true);
    await expect(repository.getCourseProgress()).resolves.toMatchObject({ practiceSessions: 1 });
  });
});
