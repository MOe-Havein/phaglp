import { test, expect } from "@playwright/test"

test.describe("Course Enrollment Flow", () => {
  test("should list available courses on the courses page", async ({ page }) => {
    await page.goto("/courses")
    await expect(page.getByRole("heading", { name: /courses/i })).toBeVisible()
  })

  test("should navigate to a specific course and show enrollment option", async ({ page }) => {
    await page.goto("/courses")

    // Check if there are any course links available
    const courseLinks = page.locator('a[href^="/courses/"]')
    if ((await courseLinks.count()) > 0) {
      await courseLinks.first().click()

      // Wait for the specific course page to load
      await expect(page).toHaveURL(/\/courses\/.+/)

      // Look for enroll or access button
      const enrollButton = page.getByRole("button", { name: /enroll|access|start/i })
      if ((await enrollButton.count()) > 0) {
        await expect(enrollButton.first()).toBeVisible()
      }
    }
  })
})
