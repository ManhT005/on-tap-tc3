import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryProgressRepository } from '../../../repositories/memory-progress.repository';
import { ProgressRepositoryProvider } from '../../../app/providers/ProgressRepositoryProvider';
import { WritingPractice } from './WritingPractice';
import { getLessonWriting } from '../../../domain/learning/lesson.service';

describe('writing draft failure recovery', () => {
  it('keeps text on failed save, retries and restores it after remounting', async () => {
    const user = userEvent.setup();
    const repository = new MemoryProgressRepository();
    const save = vi.spyOn(repository, 'saveWritingDraft').mockRejectedValue(new Error('quota'));
    const view = render(
      <ProgressRepositoryProvider repository={repository}>
        <WritingPractice />
      </ProgressRepositoryProvider>,
    );
    const text = screen.getByRole('textbox', { name: 'Câu trả lời của bạn' });
    await waitFor(() => expect(text).toBeEnabled());
    await user.type(text, '안녕하세요.');
    await user.click(screen.getByRole('button', { name: 'Lưu bản nháp' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Bản nháp chưa được xác nhận lưu');
    expect(text).toHaveValue('안녕하세요.');
    save.mockRestore();
    await user.click(screen.getByRole('button', { name: 'Lưu bản nháp' }));
    await waitFor(() =>
      expect(screen.getByText('Đã lưu bản nháp trên trình duyệt')).toBeInTheDocument(),
    );
    view.unmount();
    render(
      <ProgressRepositoryProvider repository={repository}>
        <WritingPractice />
      </ProgressRepositoryProvider>,
    );
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Câu trả lời của bạn' })).toHaveValue(
        '안녕하세요.',
      ),
    );
  });

  it('does not overwrite an unread existing draft when storage fails on load', async () => {
    const result = getLessonWriting(1);
    if (!result.ok) throw new Error('Missing prompt');
    const repository = new MemoryProgressRepository();
    await repository.saveWritingDraft({
      lessonId: 1,
      promptId: result.data[0]!.id,
      response: '기존 글',
      updatedAt: '2026-10-11T00:00:00.000Z',
    });
    vi.spyOn(repository, 'getWritingDraft').mockRejectedValueOnce(new Error('blocked'));
    const user = userEvent.setup();
    render(
      <ProgressRepositoryProvider repository={repository}>
        <WritingPractice />
      </ProgressRepositoryProvider>,
    );
    expect(await screen.findByRole('button', { name: 'Thử tải lại bản nháp' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Câu trả lời của bạn' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Thử tải lại bản nháp' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Câu trả lời của bạn' })).toHaveValue('기존 글'),
    );
  });
});
