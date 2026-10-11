import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('primary screens pass automated accessibility smoke and keyboard skip navigation', async ({
  page,
}) => {
  // Five complete axe scans take longer in Firefox than a single page interaction.
  test.setTimeout(60_000);
  for (const path of ['/', '/learn', '/practice', '/progress', '/review']) {
    await page.goto(path);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.getByRole('status', { name: /Đang tải/ })).toHaveCount(0);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      `${path}: ${JSON.stringify(results.violations.map((item) => ({ id: item.id, nodes: item.nodes.map((node) => node.target) })))}`,
    ).toEqual([]);
  }
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Bỏ qua điều hướng' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('exam is operable at 360/390/430 pixels with accessible answer controls', async ({
  page,
}, testInfo) => {
  await page.goto('/practice');
  await page.getByRole('tab', { name: 'Exam', exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu đề mới' }).click();
  const answers = page.getByRole('group', { name: 'Đáp án đề thi câu 1', exact: true });
  await expect(answers).toBeVisible();
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `Exam overflow at ${width}px`,
    ).toBe(true);
    const heights = await answers
      .getByRole('button')
      .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
    expect(heights.every((height) => height >= 44)).toBe(true);
  }
  await page.screenshot({ path: testInfo.outputPath('exam-mobile.png'), fullPage: true });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
