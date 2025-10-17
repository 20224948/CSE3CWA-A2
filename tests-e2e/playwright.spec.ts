import { test, expect } from '@playwright/test';

// tweak these if you want different timings
const ALERT_HOLD_MS = 3000;        // how long to keep the "saved" alert open
const BETWEEN_TESTS_WAIT_MS = 5000; // wait after save test completes
const POST_LOAD_HOLD_MS = 10000;    // keep page open after loading

test.describe.serial('Save & Load Run (UI)', () => {
  test('Count down 10sec. Save Run', async ({ page }) => {
    await page.goto('/escape-room');

    // Set timer to 9 minutes and let it tick a little so remainingSec < 600
    await page.waitForTimeout(10_000);

    // Catch alert + POST
    const dialogPromise = page.waitForEvent('dialog');
    const postPromise = page.waitForResponse(
      (res) => res.url().endsWith('/api/outputs') && res.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Save Run$/ }).click();

    const [dialog] = await Promise.all([dialogPromise, postPromise]);

    // ✳️ Hold the alert open longer before dismissing
    await page.waitForTimeout(ALERT_HOLD_MS);

    const message = dialog.message();
    await dialog.dismiss();

    // Extract run id from alert
    const match = message.match(/Run\s*#(\d+)/i);
    expect(match).not.toBeNull();
    const savedId = Number(match![1]);
    expect(savedId).toBeGreaterThan(0);

    // "View JSON" should be visible and point to the saved id
    const viewJson = page.getByRole('link', { name: /View JSON/i });
    await expect(viewJson).toBeVisible({ timeout: 3000 });
    await expect(viewJson).toHaveAttribute('href', `/api/outputs/${savedId}`);

    // Optional: verify persisted minutes and that remainingSec < 600
    const res = await page.request.get(`/api/outputs/${savedId}`);
    expect(res.ok()).toBeTruthy();
    const row = await res.json();
    expect(row?.data?.remainingSec).toBeLessThan(600);

    // ✳️ Wait before the next test starts
    await page.waitForTimeout(BETWEEN_TESTS_WAIT_MS);
  });

  test('Load Latest Run. Confirm JSON', async ({ page }) => {
    await page.goto('/escape-room');

    await page.waitForTimeout(5000);

    // Click "Load Latest Run"
    await page.getByRole('button', { name: /^Load Latest Run$/ }).click();

    await page.waitForTimeout(2000);

    // Wait for the View JSON link to appear
    const viewJson = page.getByRole('link', { name: /View JSON/i });
    await expect(viewJson).toBeVisible({ timeout: 3000 });

    // Click it and verify popup opens
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      viewJson.click(),
    ]);

    await popup.waitForLoadState('domcontentloaded');
    expect(popup.url()).toMatch(/\/api\/outputs\/\d+$/);

    // 🕒 Keep JSON page open for ~3 seconds
    await popup.waitForTimeout(3000);

    // Close popup
    await popup.close();

    // 🕒 Then remain on main page for 5 seconds
    await page.waitForTimeout(10000);
  });

});
