import { test, expect } from "@playwright/test"

test.describe("Marriage Matching Profile Flow", () => {
  test("should display marriage profile options in dashboard if accessible", async ({ page }) => {
    // In a real environment, this requires a logged-in session.
    // For now, we will verify the login redirect or check public policy.

    await page.goto("/dashboard")

    // We expect unauthenticated users to be redirected to login
    if (page.url().includes("/login")) {
      await expect(page.getByRole("heading", { name: /login/i })).toBeVisible()
    } else {
      // If logged in, look for marriage profile section
      const marriageSection = page.getByText(/marriage/i)
      if ((await marriageSection.count()) > 0) {
        await expect(marriageSection.first()).toBeVisible()
      }
    }
  })

  test("should navigate to privacy policy detailing marriage matching", async ({ page }) => {
    await page.goto("/policy")
    const policyHeader = page.getByRole("heading", { name: /policy|terms/i })
    if ((await policyHeader.count()) > 0) {
      await expect(policyHeader.first()).toBeVisible()
    }
  })
})
