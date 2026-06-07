// tests/control-blog-new.test.ts
import { test, expect } from '@playwright/test';

test('Load /control/blog/new page', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/control/blog/new');
  expect(response?.ok()).toBeTruthy();
  // Verify the page contains the expected heading or form element
  const heading = await page.locator('h1, h2, h3').first();
  await expect(heading).toBeVisible();
});
