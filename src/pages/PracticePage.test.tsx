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

    // Button disabled when response is empty
    expect(screen.getByRole('button', { name: 'Đạt yêu cầu' })).toBeDisabled();

    // Type answer into controlled textarea
    const textarea = screen.getByRole('textbox', { name: 'Câu trả lời của bạn' });
    await user.type(textarea, '저는 한국학과 2학년 흐엉이라고 합니다.');
    expect(screen.getByRole('button', { name: 'Đạt yêu cầu' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Đạt yêu cầu' }));
    expect(await screen.findByText('Đã lưu: Đạt yêu cầu.')).toBeInTheDocument();
    await expect(repository.getCourseProgress()).resolves.toMatchObject({ practiceSessions: 1 });

    await user.click(screen.getByRole('tab', { name: 'Exam' }));
    expect(screen.getByRole('button', { name: 'Sắp ra mắt' })).toBeDisabled();
  });

  it('Reading practice: selecting empty lesson 4 shows empty state, selecting lesson 1 recovers', async () => {
    const user = userEvent.setup();
    renderPracticePage();

    await user.click(screen.getByRole('tab', { name: 'Reading' }));
    expect(await screen.findByRole('combobox', { name: 'Bài học' })).toBeInTheDocument();

    // Select Lesson 15 (has no reading passages)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Bài học' }), '15');
    expect(screen.getByText('Chưa có bài đọc')).toBeInTheDocument();
    // Selector is still visible and functional
    expect(screen.getByRole('combobox', { name: 'Bài học' })).toBeInTheDocument();

    // Switch back to Lesson 1
    await user.selectOptions(screen.getByRole('combobox', { name: 'Bài học' }), '1');
    const reading = getLessonReading(1);
    if (!reading.ok || !reading.data[0]) throw new Error('Expected lesson 1 reading');
    expect(screen.getByRole('heading', { name: reading.data[0].title })).toBeInTheDocument();
  });

  it('Writing practice: selecting empty lesson 15 shows empty state, selecting lesson 1 recovers', async () => {
    const user = userEvent.setup();
    renderPracticePage();

    await user.click(screen.getByRole('tab', { name: 'Writing' }));
    expect(await screen.findByRole('combobox', { name: 'Bài học' })).toBeInTheDocument();

    // Select Lesson 15 (has no writing prompt)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Bài học' }), '15');
    expect(screen.getByText('Chưa có đề bài viết')).toBeInTheDocument();
    // Selector is still visible and functional
    expect(screen.getByRole('combobox', { name: 'Bài học' })).toBeInTheDocument();

    // Switch back to Lesson 1
    await user.selectOptions(screen.getByRole('combobox', { name: 'Bài học' }), '1');
    expect(screen.getByRole('button', { name: 'Hiện bài mẫu' })).toBeInTheDocument();
  });

  it('Writing practice: keeps self-check disabled for whitespace-only response', async () => {
    const user = userEvent.setup();
    renderPracticePage();

    await user.click(screen.getByRole('tab', { name: 'Writing' }));
    await user.click(screen.getByRole('button', { name: 'Hiện bài mẫu' }));

    const textarea = screen.getByRole('textbox', { name: 'Câu trả lời của bạn' });
    await user.type(textarea, '   ');
    expect(screen.getByRole('button', { name: 'Đạt yêu cầu' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cần luyện thêm' })).toBeDisabled();
  });

  it('Reading practice: scores reading and records completion in repository', async () => {
    const user = userEvent.setup();
    const { repository } = renderPracticePage();
    const reading = getLessonReading(1);
    if (!reading.ok || !reading.data[0]) throw new Error('Expected lesson 1 reading data');

    await user.click(screen.getByRole('tab', { name: 'Reading' }));
    for (const question of reading.data[0].questions) {
      const group = screen.getByRole('group', { name: `Đáp án cho câu ${question.id}` });
      const options = within(group).getAllByRole('button');
      const correctOption = options[question.correctIndex];
      if (!correctOption) throw new Error('Expected option');
      await user.click(correctOption);
    }

    await user.click(screen.getByRole('button', { name: 'Chấm điểm bài đọc' }));
    expect(await screen.findByRole('button', { name: 'Luyện lại bài đọc' })).toBeInTheDocument();
    await expect(repository.getCourseProgress()).resolves.toMatchObject({
      practiceSessions: 1,
      accuracy: 100,
    });
  });
});
