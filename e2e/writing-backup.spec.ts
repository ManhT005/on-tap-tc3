import { expect, test } from '@playwright/test';

test('writing drafts survive prompt changes, reload, submission, backup and restore', async ({
  page,
}) => {
  await page.goto('/practice');
  await page.getByRole('tab', { name: 'Writing' }).click();
  const response = page.getByRole('textbox', { name: 'Câu trả lời của bạn' });
  await response.fill('저는 한국어를 공부합니다.');
  await expect(page.getByText('Đã lưu bản nháp trên trình duyệt')).toBeVisible();
  await page.getByRole('combobox', { name: 'Đề viết' }).selectOption('1');
  await expect(response).toHaveValue('');
  await response.fill('새 글입니다.');
  await page.getByRole('combobox', { name: 'Đề viết' }).selectOption('0');
  await expect(response).toHaveValue('저는 한국어를 공부합니다.');
  await page.reload();
  await page.getByRole('tab', { name: 'Writing' }).click();
  await expect(response).toHaveValue('저는 한국어를 공부합니다.');
  await page.getByRole('button', { name: 'Hiện bài mẫu' }).click();
  await page.getByRole('button', { name: 'Đạt yêu cầu' }).click();
  await expect(page.getByText('Đã lưu: Đạt yêu cầu.')).toBeVisible();
  await page.goto('/progress');
  await expect(page.getByText('Tự đánh giá: Đạt yêu cầu', { exact: false })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất bản sao lưu JSON' }).click();
  const file = await download;
  const path = await file.path();
  if (!path) throw new Error('No backup download path');
  await page.getByLabel('Chọn file khôi phục').setInputFiles(path);
  await expect(page.getByText(/Xem trước:.*1 lượt luyện tập/)).toBeVisible();
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Khôi phục và thay dữ liệu' }).click();
  await expect(page.getByText('Đã khôi phục dữ liệu.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Tự đánh giá: Đạt yêu cầu', { exact: false })).toBeVisible();
});
