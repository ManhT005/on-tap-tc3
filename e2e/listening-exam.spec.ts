import { expect, test } from '@playwright/test';
import { LISTENING_BANK } from '../src/data/listening-bank';

test('listening reports missing Korean voice without pretending audio is playable', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'speechSynthesis', {
      value: { getVoices: () => [], addEventListener() {}, removeEventListener() {}, cancel() {} },
    }),
  );
  await page.goto('/practice');
  await page.getByRole('tab', { name: 'Listening' }).click();
  await expect(page.getByText(/Bài nghe chưa phát được/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nghe bài', exact: true })).toBeDisabled();
});

test('listening recovers from a speech failure, scores and persists an attempt', async ({
  page,
}) => {
  await page.addInitScript(() => {
    let fail = true;
    class Utterance extends EventTarget {
      text: string;
      lang = '';
      rate = 1;
      voice: unknown = null;
      constructor(text: string) {
        super();
        this.text = text;
      }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance });
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        getVoices: () => [{ lang: 'ko-KR', name: 'Test fixture voice', localService: true }],
        addEventListener() {},
        removeEventListener() {},
        cancel() {},
        speak(utterance: EventTarget) {
          if (fail) {
            fail = false;
            utterance.dispatchEvent(new Event('error'));
          } else {
            utterance.dispatchEvent(new Event('start'));
            setTimeout(() => utterance.dispatchEvent(new Event('end')), 100);
          }
        },
      },
    });
  });
  await page.goto('/practice');
  await page.getByRole('tab', { name: 'Listening' }).click();
  await page.getByRole('button', { name: 'Nghe bài', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Không phát được giọng đọc');
  await page.getByRole('button', { name: 'Nghe bài', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  const question = LISTENING_BANK[0]!.questions[0]!;
  await page
    .getByRole('group', { name: `Đáp án cho câu ${question.id}` })
    .getByRole('button')
    .nth(question.correctIndex)
    .click();
  await page.getByRole('button', { name: 'Chấm điểm bài nghe' }).click();
  await expect(page.getByText('Đã lưu kết quả nghe: 1/1 · 100%')).toBeVisible();
  await page.goto('/progress');
  await expect(
    page.locator('.stat-card').filter({ hasText: 'Lượt luyện tập' }).locator('strong'),
  ).toHaveText('1');
});

test('timed exam keeps answers/deadline through reload, expires once and retains results', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-10-11T00:00:00.000Z') });
  await page.goto('/practice');
  await page.getByRole('tab', { name: 'Exam', exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu đề mới' }).click();
  await expect(page.getByRole('timer')).toContainText('30:00');
  await page
    .getByRole('group', { name: 'Đáp án đề thi câu 1', exact: true })
    .getByRole('button')
    .first()
    .click();
  await expect(page.getByText('Đã trả lời 1/30 · Đã lưu trên trình duyệt')).toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: 'Exam', exact: true }).click();
  await expect(page.getByText('Đã trả lời 1/30 · Đã lưu trên trình duyệt')).toBeVisible();
  await page.clock.fastForward(30 * 60 * 1000);
  await page.clock.runFor(1000);
  await expect(page.getByRole('heading', { name: 'Hết giờ · đã lưu kết quả' })).toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: 'Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hết giờ · đã lưu kết quả' })).toBeVisible();
  await page.goto('/progress');
  await expect(
    page.locator('.stat-card').filter({ hasText: 'Lượt luyện tập' }).locator('strong'),
  ).toHaveText('1');
});
