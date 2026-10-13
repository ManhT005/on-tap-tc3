import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function stored(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('on-tap-tc3');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const tx = db.transaction(['settings', 'review_status']);
    const values = await Promise.all(
      ['settings', 'review_status'].map(
        (name) =>
          new Promise<unknown[]>((resolve, reject) => {
            const request = tx.objectStore(name).getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          }),
      ),
    );
    db.close();
    return {
      settings: values[0] as { key: string; value: { grades: Record<string, number> } }[],
      reviews: values[1] as { itemId: string; repetitions: number }[],
    };
  });
}
test('lesson has a compact lab entry; batch grades survive reload and previous viewing', async ({
  page,
}) => {
  await page.goto('/learn/1');
  await expect(page.getByRole('button', { name: 'Hiện nghĩa' })).toHaveCount(4);
  await page.getByRole('link', { name: 'Học từ vựng bài này' }).click();
  const progress = page.getByRole('region', { name: 'Tiến độ từ vựng' });
  await expect(progress).toContainText('Phiên: 0/10');
  await expect(page.locator('.vocab-meaning')).toHaveCount(0);
  await page.getByRole('button', { name: 'Hiện nghĩa', exact: true }).click();
  await expect(page.locator('.vocab-meaning')).toBeVisible();
  await expect(page.getByText('Chưa có câu ví dụ được kiểm duyệt.')).toHaveCount(0);
  await page.getByRole('button', { name: '4 · Rất chắc' }).click();
  await expect(progress).toContainText('Phiên: 1/10');
  await page.reload();
  await expect(progress).toContainText('Phiên: 1/10');
  await page.getByRole('button', { name: 'Từ trước' }).click();
  await page.getByRole('button', { name: 'Hiện nghĩa', exact: true }).click();
  await expect(page.getByRole('button', { name: '1 · Không nhớ' })).toBeDisabled();
  expect((await stored(page)).reviews[0]?.repetitions).toBe(1);
});
test('two tabs and same-tick duplicate grade save one review in a shared batch', async ({
  page,
  context,
}) => {
  await page.goto('/vocabulary?lesson=1');
  await page.getByRole('button', { name: 'Hiện nghĩa', exact: true }).click();
  const other = await context.newPage();
  await other.goto('/vocabulary?lesson=1');
  await other.getByRole('button', { name: 'Hiện nghĩa', exact: true }).click();
  await Promise.all(
    [page, other].map((tab) =>
      tab.getByRole('button', { name: '4 · Rất chắc' }).evaluate((button: HTMLButtonElement) => {
        button.click();
        button.click();
      }),
    ),
  );
  await expect.poll(async () => (await stored(page)).reviews[0]?.repetitions).toBe(1);
  await expect
    .poll(
      async () =>
        Object.keys(
          (await stored(page)).settings.find((setting) => setting.key === 'vocabulary-session:1')!
            .value.grades,
        ).length,
    )
    .toBe(1);
  await other.close();
});
test('batch size, recall, summary and catalog filtering use actual course content', async ({
  page,
}) => {
  await page.goto('/vocabulary?lesson=1');
  await expect(page.getByRole('button', { name: 'Hiện nghĩa', exact: true })).toBeVisible();
  await page.getByLabel('Số từ mỗi lượt').selectOption('5');
  await page.getByRole('button', { name: 'Bắt đầu bộ đã chọn' }).click();
  for (let index = 0; index < 5; index++) {
    await page.getByRole('button', { name: 'Hiện nghĩa', exact: true }).click();
    await page.getByRole('button', { name: '1 · Không nhớ' }).click();
    await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText(
      `Phiên: ${index + 1}/5`,
    );
  }
  await expect(page.getByRole('heading', { name: 'Đã hoàn thành lượt học' })).toBeVisible();
  await page.getByRole('button', { name: 'Ôn lại từ khó' }).click();
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 0/5');
  await page.getByRole('button', { name: 'Nhớ nghĩa', exact: true }).click();
  await page.getByRole('button', { name: 'Học kỳ', exact: true }).click();
  await page.getByRole('button', { name: 'Lưu và tiếp tục' }).click();
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 1/5');
  await page.getByRole('button', { name: 'Danh sách', exact: true }).click();
  await page.getByLabel('Tìm từ', { exact: true }).fill('등록금');
  await expect(page.locator('.vocab-catalog__item')).toHaveCount(3);
  await page.locator('.vocab-catalog__item').first().click();
  await expect(page.getByRole('heading', { name: '등록금', exact: true })).toBeVisible();
});
test('reading lookup is accessible, bookmarks a stable ID and reports unknown forms honestly', async ({
  page,
  context,
}) => {
  await page.goto('/practice');
  await page.getByRole('tab', { name: 'Reading', exact: true }).click();
  await page.getByRole('button', { name: 'Bật tra từ' }).click();
  await context.setOffline(true);
  const word = page.getByRole('button', { name: 'Tra từ 학기', exact: true }).first();
  await word.click();
  const dialog = page.getByRole('dialog', { name: 'Tra từ trong học liệu' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Học kỳ');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await dialog.evaluate((element) => element.getBoundingClientRect().width <= window.innerWidth),
  ).toBe(true);
  await dialog.getByRole('button', { name: 'Lưu để ôn', exact: true }).first().click();
  await expect(dialog.getByRole('button', { name: 'Đã lưu để ôn' })).toBeVisible();
  expect(
    (await stored(page)).reviews.find((item) => item.itemId === 'vocab-01-0001')?.repetitions,
  ).toBe(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(word).toBeFocused();
  await page.getByRole('button', { name: 'Tra từ thủ công' }).click();
  await dialog.getByLabel('Tìm nguyên dạng hoặc nghĩa').fill('신청했어요');
  await dialog.getByRole('button', { name: 'Tìm trong học liệu' }).click();
  await expect(dialog.getByText(/Chưa có kết quả/)).toBeVisible();
});
test('listening lookup exists only after transcript reveal; exam has none', async ({ page }) => {
  await page.goto('/practice');
  await page.getByRole('tab', { name: 'Listening', exact: true }).click();
  await expect(page.locator('.contextual-vocabulary')).toHaveCount(0);
  await page.getByRole('button', { name: 'Hiện lời thoại & bản dịch' }).click();
  await expect(page.locator('.contextual-vocabulary')).toHaveCount(1);
  await page.getByRole('button', { name: 'Bật tra từ' }).click();
  await expect(page.locator('.context-word').first()).toBeVisible();
  await page.getByRole('button', { name: 'Ẩn lời thoại' }).click();
  await expect(page.locator('.contextual-vocabulary')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Exam', exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu đề mới' }).click();
  await expect(page.locator('.contextual-vocabulary')).toHaveCount(0);
});
test('lab keyboard and mobile layouts pass accessibility without grading from inputs', async ({
  page,
}, testInfo) => {
  await page.goto('/vocabulary?lesson=1');
  const card = page.getByLabel('Phím tắt thẻ từ vựng');
  await expect(card).toBeVisible();
  await card.focus();
  await page.keyboard.press('4');
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 0/10');
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: '4 · Rất chắc' })).toBeVisible();
  await page.getByLabel('Tìm từ', { exact: true }).fill('4');
  await page.keyboard.press('4');
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 0/10');
  await page.getByLabel('Tìm từ', { exact: true }).fill('');
  await card.focus();
  await page.keyboard.press('4');
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 1/10');
  for (const width of [360, 390, 430, 768]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: testInfo.outputPath('vocabulary-mobile.png'), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

for (const viewport of [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  test(`mobile study dock keeps the word and grading usable at ${viewport.width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('/vocabulary?lesson=1');
    const reveal = page.getByRole('button', { name: 'Hiện nghĩa', exact: true });
    await expect(reveal).toBeVisible();
    await expect(page.getByLabel('Tìm từ', { exact: true })).toBeHidden();
    await expect(page.locator('.vocab-keyboard-hint')).toBeHidden();
    await expect(page.locator('.vocab-rail')).toBeHidden();
    await expect(page.getByRole('heading', { name: '학기', exact: true })).toBeVisible();
    await reveal.click();
    const dock = page.locator('.vocab-study-controls');
    await expect(page.locator('.vocab-meaning')).toContainText('Học kỳ');
    // A visible button must also be inside the viewport and receive a real tap.
    for (const button of await page.locator('.vocab-grades button').all()) {
      const box = (await button.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      await button.click({ trial: true });
    }
    const meaning = (await page.locator('.vocab-meaning').boundingBox())!;
    // Leave breathing room for differences in browser font metrics, not just zero overlap.
    expect(meaning.y + meaning.height + 8).toBeLessThanOrEqual((await dock.boundingBox())!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: testInfo.outputPath(`mobile-${viewport.width}.png`) });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole('button', { name: '4 · Rất chắc' }).click();
    await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText(
      'Phiên: 1/10',
    );
    await expect(reveal).toBeVisible();
    await expect(page.locator('.vocab-meaning')).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText(
      'Phiên: 1/10',
    );
  });
}

test('mobile configuration, recall and enlarged text do not trap or cover controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/vocabulary?lesson=1');
  await page.getByRole('button', { name: 'Bộ học / Tìm từ' }).click();
  await expect(page.locator('.vocab-study-controls')).toBeHidden();
  await page.getByLabel('Số từ mỗi lượt').selectOption('5');
  await page.getByRole('button', { name: 'Bắt đầu bộ đã chọn' }).click();
  await expect(page.getByLabel('Tìm từ', { exact: true })).toBeHidden();
  await page.getByRole('combobox', { name: 'Chế độ học', exact: true }).selectOption('recall');
  await page.getByRole('button', { name: 'Học kỳ', exact: true }).click();
  await page.getByRole('button', { name: 'Lưu và tiếp tục' }).click();
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 1/5');
  await page.getByRole('combobox', { name: 'Chế độ học', exact: true }).selectOption('list');
  await expect(page.locator('.vocab-study-controls')).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Chế độ học', exact: true }).selectOption('context');
  await expect(page.locator('.contextual-vocabulary')).toBeVisible();
  await page.getByRole('combobox', { name: 'Chế độ học', exact: true }).selectOption('flashcard');
  await page.getByRole('button', { name: 'Hiện nghĩa', exact: true }).click();
  await page.addStyleTag({
    content: '.vocab-study-controls .button { font-size: 24px !important; }',
  });
  await expect
    .poll(async () => {
      const height = (await page.locator('.vocab-study-controls').boundingBox())!.height;
      return page
        .locator('.vocabulary-lab')
        .evaluate(
          (element, expected) =>
            Number.parseFloat(element.style.getPropertyValue('--vocab-dock-height')) >=
            expected - 1,
          height,
        );
    })
    .toBe(true);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const stats = (await page.getByRole('button', { name: 'Xem hành trình ghi nhớ' }).boundingBox())!;
  expect(stats.y + stats.height).toBeLessThanOrEqual(
    (await page.locator('.vocab-study-controls').boundingBox())!.y,
  );
  await page.getByRole('button', { name: 'Xem hành trình ghi nhớ' }).click();
  await expect(page.locator('.vocab-rail')).toBeVisible();
  await page.getByRole('button', { name: '4 · Rất chắc' }).click();
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 2/5');
  await expect
    .poll(async () => (await page.locator('.vocab-hangul').boundingBox())!.y)
    .toBeGreaterThanOrEqual(0);
});

test('short mobile viewport allows long card content to scroll above the dock', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/vocabulary?lesson=1');
  await page.getByRole('button', { name: 'Hiện nghĩa', exact: true }).click();
  await page.getByText('Cụm liên quan', { exact: true }).click();
  await page
    .locator('.vocab-card__back')
    .evaluate((element) => element.scrollIntoView({ block: 'start' }));
  const meaning = (await page.locator('.vocab-meaning').boundingBox())!;
  const dock = (await page.locator('.vocab-study-controls').boundingBox())!;
  expect(meaning.y + meaning.height).toBeLessThanOrEqual(dock.y);
  expect(dock.y).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '3 · Nhớ được' }).click();
  await expect(page.getByRole('region', { name: 'Tiến độ từ vựng' })).toContainText('Phiên: 1/10');
});
