import { expect, test } from '@playwright/test';
import { QUIZ_BANK } from '../src/data/quiz-bank';

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
    await expect(lessonLink).toBeVisible();
    const lessonLinkHeight = await lessonLink.evaluate(
      (link) => link.getBoundingClientRect().height,
    );
    expect(lessonLinkHeight).toBeGreaterThanOrEqual(44);
  }
});

async function completeLessonOneWithWrongAnswers(page: import('@playwright/test').Page) {
  await page.goto('/learn/1');
  await expect(page.getByRole('heading', { name: 'Nhớ lại trước khi xem' })).toBeVisible();

  for (const question of QUIZ_BANK.filter((item) => item.lessonId === 1)) {
    const answerGroup = page.getByRole('group', { name: `Đáp án cho câu ${question.id}` });
    const answerButtons = answerGroup.getByRole('button');
    await answerButtons.nth((question.correctIndex + 1) % question.options.length).click();
  }

  await page.getByRole('button', { name: 'Hoàn thành bài học' }).click();
  await expect(page.getByRole('heading', { name: 'Bài luyện tập đã hoàn thành' })).toBeVisible();
}

async function setReviewItemDue(page: import('@playwright/test').Page, itemId: string) {
  await page.evaluate(async (reviewItemId) => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('on-tap-tc3', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const transaction = database.transaction('review_status', 'readwrite');
    const store = transaction.objectStore('review_status');
    const request = store.get(['question', reviewItemId]);

    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        item.nextReviewAt = new Date(Date.now() - 60_000).toISOString();
        store.put(item);
      }
    };

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    database.close();
  }, itemId);
}

test('E2E-LEARN-01 Complete lesson, persist progress, and retain it after reload', async ({
  page,
}) => {
  await completeLessonOneWithWrongAnswers(page);
  await page.goto('/progress');

  const completedTile = page.locator('.stat-card').filter({ hasText: 'Bài đã hoàn thành' });
  const sessionTile = page.locator('.stat-card').filter({ hasText: 'Lượt luyện tập' });
  await expect(completedTile.locator('strong')).toHaveText('1');
  await expect(sessionTile.locator('strong')).toHaveText('1');

  await page.reload();
  await expect(completedTile.locator('strong')).toHaveText('1');
  await expect(sessionTile.locator('strong')).toHaveText('1');
});

test('E2E-REVIEW-01 Wrong practice answers appear in recent mistakes', async ({ page }) => {
  await completeLessonOneWithWrongAnswers(page);
  await page.goto('/review');

  await expect(page.getByRole('heading', { name: 'Lỗi gần đây' })).toBeVisible();
  await expect(page.locator('.recent-mistakes li')).toHaveCount(5);
});

test('E2E-REVIEW-02 Grade a due item and remove it from today queue', async ({ page }) => {
  await completeLessonOneWithWrongAnswers(page);
  const firstLessonQuestion = QUIZ_BANK.find((question) => question.lessonId === 1);
  if (!firstLessonQuestion) throw new Error('Expected Lesson 1 quiz content.');
  await setReviewItemDue(page, String(firstLessonQuestion.id));
  await page.goto('/review');

  const dueRegion = page.getByRole('region', { name: 'Đến hạn' });
  const item = dueRegion.locator('.review-queue-item').first();
  await expect(item).toBeVisible();
  const prompt = await item.locator('h2').innerText();
  await item.getByRole('button', { name: 'Hiện đáp án' }).click();
  await item.getByRole('button', { name: '3', exact: true }).click();
  await item.getByRole('button', { name: 'Lưu kết quả ôn' }).click();

  await expect(dueRegion.getByRole('heading', { name: prompt })).toHaveCount(0);
  await expect(page.locator('.recent-mistakes')).toBeVisible();
});

test('E2E-MOBILE-01 Home to Lesson and Practice at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Learn' })
    .click();
  await page.getByRole('link', { name: 'Mở bài học' }).first().click();
  await expect(page.getByRole('heading', { name: 'Bài 01' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Practice' })
    .click();
  await expect(page.getByRole('tab', { name: 'Quiz' })).toBeVisible();
  await expect(
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).resolves.toBe(true);
});
