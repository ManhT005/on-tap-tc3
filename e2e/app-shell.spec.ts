import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('E2E-P1-001 Home loads', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
});

test('E2E-P1-002 Navigate Learn', async ({ page }) => {
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Learn' })
    .click();

  await expect(page.getByRole('heading', { name: 'Learn' })).toBeVisible();
});

test('E2E-P1-003 Open lesson and go back', async ({ page }) => {
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Learn' })
    .click();
  await page.getByRole('link', { name: 'Mở bài học' }).first().click();

  await expect(page.getByRole('heading', { name: 'Bài 01' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Learn' })).toBeVisible();
});

test('E2E-P1-004 Navigate Practice', async ({ page }) => {
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Practice' })
    .click();

  await expect(page.getByRole('heading', { name: 'Practice' })).toBeVisible();
});

test('E2E-P1-005 Navigate Review', async ({ page }) => {
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Review' })
    .click();

  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
});

test('E2E-P1-006 Navigate Progress', async ({ page }) => {
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Progress' })
    .click();

  await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();
});

test('E2E-P1-007 Invalid lesson shows not found', async ({ page }) => {
  await page.goto('/learn/999');

  await expect(page.getByRole('heading', { name: 'Không tìm thấy bài học' })).toBeVisible();
});

test('E2E-P1-008 Mobile navigation stays usable without page overflow', async ({ page }) => {
  for (const width of [360, 390, 430]) {
    await page.goto('/');
    await page.setViewportSize({ width, height: 844 });

    const pageOverflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    const navigation = page.getByRole('navigation', { name: 'Điều hướng chính' });
    const navigationLinks = navigation.getByRole('link');
    const linkHeights = await navigationLinks.evaluateAll((links) =>
      links.map((link) => link.getBoundingClientRect().height),
    );

    expect(pageOverflows, `Page overflowed at ${width}px`).toBe(false);
    expect(linkHeights).toHaveLength(5);
    expect(linkHeights.every((height) => height >= 44)).toBe(true);

    await navigation.getByRole('link', { name: 'Learn' }).click();
    const lessonLink = page.getByRole('link', { name: 'Mở bài học' }).first();
    const lessonLinkHeight = await lessonLink.evaluate(
      (link) => link.getBoundingClientRect().height,
    );
    expect(lessonLinkHeight).toBeGreaterThanOrEqual(44);
  }
});
