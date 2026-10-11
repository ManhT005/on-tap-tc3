import { expect, test } from '@playwright/test';
import { QUIZ_BANK } from '../src/data/quiz-bank';

for (const lessonId of [1, 8, 15]) {
  test(`lesson ${lessonId}: honest progress, checklist reload and quiz persistence`, async ({
    page,
  }) => {
    await page.goto(`/learn/${lessonId}`);
    const checklist = page.getByRole('region', { name: 'Tiến độ bài học' });
    await expect(checklist).toContainText('0%');
    await page.getByRole('button', { name: 'Hiện nghĩa' }).first().click();
    await page.getByRole('button', { name: '4 · Rất chắc' }).first().click();
    await expect(checklist).toContainText('Nhớ lại: 1/4');
    await page.getByRole('button', { name: 'Đánh dấu đã học cấu trúc này' }).first().click();
    await expect(checklist).toContainText('Ngữ pháp: 1/');
    await page.reload();
    await expect(checklist).toContainText('Nhớ lại: 1/4');
    await expect(checklist).toContainText('Ngữ pháp: 1/');
    for (const question of QUIZ_BANK.filter((item) => item.lessonId === lessonId)) {
      await page
        .getByRole('group', { name: `Đáp án cho câu ${question.id}` })
        .getByRole('button')
        .nth((question.correctIndex + 1) % 4)
        .click();
    }
    await page.getByRole('button', { name: 'Nộp luyện tập nhanh' }).click();
    await expect(page.getByRole('heading', { name: 'Bài luyện tập đã hoàn thành' })).toBeVisible();
    await expect(checklist).toContainText('Đã nộp');
    await expect(checklist).not.toContainText('100%');
    await page.reload();
    await expect(checklist).toContainText('Đã nộp');
    await page.goto('/progress');
    await expect(page.locator('.stat-card').filter({ hasText: 'Lượt luyện tập' })).toContainText(
      '1',
    );
  });
}

test('storage failure reports unknown progress and a global recovery action', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', {
      get() {
        throw new Error('storage blocked');
      },
    });
  });
  await page.goto('/progress');
  await expect(page.getByText('Không tải được dữ liệu', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Thử kết nối lại bộ nhớ' })).toBeVisible();
  await expect(page.locator('.stat-card')).toHaveCount(0);
});
