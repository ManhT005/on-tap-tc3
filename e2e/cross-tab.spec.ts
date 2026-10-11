import { expect, test } from '@playwright/test';

test('two tabs grade the same item without lost updates; same-tick double clicks commit once per tab', async ({
  page,
  context,
}) => {
  await page.goto('/review');
  await expect(page.getByText('Bạn đã ôn hết mục đến hạn')).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('on-tap-tc3');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const tx = db.transaction('review_status', 'readwrite');
    tx.objectStore('review_status').put({
      itemId: '101',
      itemType: 'question',
      repetitions: 0,
      correctCount: 0,
      wrongCount: 0,
      lastReviewedAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() - 1).toISOString(),
      intervalDays: 0,
      confidence: 1,
      box: 0,
    });
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  });
  const other = await context.newPage();
  await other.goto('/review');
  await page.reload();
  for (const tab of [page, other]) {
    await tab.getByRole('button', { name: 'Hiện đáp án' }).click();
    await tab.getByRole('button', { name: '3', exact: true }).click();
  }
  await Promise.all(
    [page, other].map((tab) =>
      tab.evaluate(() => {
        const button = [...document.querySelectorAll<HTMLButtonElement>('button')].find(
          (item) => item.textContent?.trim() === 'Lưu kết quả ôn',
        );
        if (!button) throw new Error('Missing grade control');
        button.click();
        button.click();
      }),
    ),
  );
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open('on-tap-tc3');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const item = await new Promise<{ repetitions: number; correctCount: number; box: number }>(
          (resolve, reject) => {
            const request = db
              .transaction('review_status')
              .objectStore('review_status')
              .get(['question', '101']);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          },
        );
        db.close();
        return item;
      }),
    )
    .toMatchObject({ repetitions: 2, correctCount: 2, box: 2 });
});
