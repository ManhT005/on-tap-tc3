import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProgressRepositoryProvider } from '../app/providers/ProgressRepositoryProvider';
import { getLessonQuiz, getLessonReading } from '../domain/learning/lesson.service';
import { MemoryProgressRepository } from '../repositories/memory-progress.repository';
import { PracticePage } from './PracticePage';

function renderPracticePage() {
  const repository = new MemoryProgressRepository(() => new Date('2026-10-01T08:00:00.000Z'));
  const view = render(
    <ProgressRepositoryProvider repository={repository}>
      <MemoryRouter>
        <PracticePage />
      </MemoryRouter>
    </ProgressRepositoryProvider>,
  );
  return { repository, ...view };
}

describe('PracticePage', () => {
  it('filters by lesson, scores a quiz, and persists its result', async () => {
    const user = userEvent.setup();
    const { repository } = renderPracticePage();
    const quiz = getLessonQuiz(1);
    if (!quiz.ok) throw new Error('Expected lesson 1 quiz data.');

    await user.selectOptions(screen.getByLabelText('Bộ câu hỏi'), 'lesson');
    expect(screen.getByText(`${quiz.data.length} câu hỏi phù hợp`)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Bắt đầu quiz' }));

    for (const question of quiz.data.slice(0, 10)) {
      const group = screen.getByRole('group', { name: `Đáp án cho câu ${question.id}` });
      const options = within(group).getAllByRole('button');
      const correct = options[question.correctIndex];
      if (!correct) throw new Error('Expected a correct answer option.');
      await user.click(correct);
    }

    await user.click(screen.getByRole('button', { name: 'Chấm điểm và lưu kết quả' }));
    expect(await screen.findByRole('heading', { name: 'Đã lưu kết quả' })).toBeInTheDocument();
    await expect(repository.getCourseProgress()).resolves.toMatchObject({
      practiceSessions: 1,
      accuracy: 100,
    });
  });

  it('renders a reading passage and reveals its translation', async () => {
    const user = userEvent.setup();
    renderPracticePage();
    const reading = getLessonReading(1);
    if (!reading.ok || !reading.data[0]) throw new Error('Expected lesson 1 reading data.');

    await user.click(screen.getByRole('tab', { name: 'Reading' }));
    expect(await screen.findByRole('heading', { name: reading.data[0].title })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hiện bản dịch' }));
    expect(screen.getByText(reading.data[0].vietnameseTranslation ?? '')).toBeInTheDocument();
  });

  it('reveals a writing model, saves self-check, and keeps Exam disabled', async () => {
    const user = userEvent.setup();
    const { repository } = renderPracticePage();

    await user.click(screen.getByRole('tab', { name: 'Writing' }));
    await user.click(screen.getByRole('button', { name: 'Hiện bài mẫu' }));
    expect(screen.getByText(/저는 한국학과/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Đạt yêu cầu' }));
    expect(await screen.findByText('Đã lưu: Đạt yêu cầu.')).toBeInTheDocument();
    await expect(repository.getCourseProgress()).resolves.toMatchObject({ practiceSessions: 1 });

    await user.click(screen.getByRole('tab', { name: 'Exam' }));
    expect(screen.getByRole('button', { name: 'Sắp ra mắt' })).toBeDisabled();
  });
});
