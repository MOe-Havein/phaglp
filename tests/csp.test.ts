// tests/csp.test.ts
import { test, expect } from '@playwright/test';

test('Content Security Policy header is present', async ({ page }) => {
  const response = await page.goto('/');
  // Ensure the response is ok
  expect(response?.ok()).toBeTruthy();
  const csp = response?.headers()['content-security-policy'];
  console.log('CSP Header:', csp);
  expect(csp).toBeDefined();
  // Basic check that script-src includes Cloudinary widget URL
  expect(csp).toContain('https://upload-widget.cloudinary.com');
});
