# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** testa-next15-app
- **Date:** 2026-05-28
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

### Requirement: Admin/User Login
- **Description:** Verifies that a user can login, handle invalid credentials, and manage authenticated states.

#### Test TC001 Sign in and reach the dashboard
- **Test Code:** [TC001_Sign_in_and_reach_the_dashboard.py](./TC001_Sign_in_and_reach_the_dashboard.py)
- **Test Error:** TEST FAILURE: Submitting the provided credentials did not grant access to the dashboard — authorization failed.
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/41506a38-54ed-4831-b75e-ed82f4d074f0)
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** The login page displays "Invalid credentials or authorization failed." The user `admin@moe.com` was not seeded correctly in the database. The prisma seed script (`prisma/seed.ts`) defines the creation of a user with a `password` field instead of `passwordHash`, and does not supply the required `lecturePreferences` field. Consequently, the seed failed, leaving the database without the required user record.

---

#### Test TC009 Show a sign-in failure for invalid credentials
- **Test Code:** [TC009_Show_a_sign_in_failure_for_invalid_credentials.py](./TC009_Show_a_sign_in_failure_for_invalid_credentials.py)
- **Test Error:** None
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/f8bf5cd6-7d5b-46ff-999a-932ffe8d058d)
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The login form successfully handles invalid credentials by displaying the appropriate failure message and preventing authentication.

---

### Requirement: Landing Page Navigation
- **Description:** Verifies home page rendering, navigation to standard pages, and public page exposure.

#### Test TC002 Block dashboard access without signing in
- **Test Code:** [TC002_Block_dashboard_access_without_signing_in.py](./TC002_Block_dashboard_access_without_signing_in.py)
- **Test Error:** None
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/266c0bc3-36b4-4999-aca4-cd445e19e877)
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The application has proper route protection in place. Unauthenticated visitors are correctly redirected to the sign-in page.

---

#### Test TC003 Visit the home page and open the login page
- **Test Code:** [TC003_Visit_the_home_page_and_open_the_login_page.py](./TC003_Visit_the_home_page_and_open_the_login_page.py)
- **Test Error:** None
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/8257ddc3-b182-4b2d-ad86-7820e8ef83ee)
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The visitor can successfully navigate from the landing page to the login page via the header navigation.

---

#### Test TC004 Visit the home page and open the courses catalog
- **Test Code:** [TC004_Visit_the_home_page_and_open_the_courses_catalog.py](./TC004_Visit_the_home_page_and_open_the_courses_catalog.py)
- **Test Error:** TEST BLOCKED: The home page cannot be used to discover featured content because the site is returning a server-side application error.
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/5a399203-a679-472c-b2d4-cd17b8cbc295)
- **Status:** ❌ Blocked
- **Severity:** HIGH
- **Analysis / Findings:** The homepage crashed with a server-side exception (Digest: 1030498632) due to an unhandled database query error on missing/empty tables (e.g. Course, Lecture, HomepageSection). Specifically, when the homepage tries to render courses or lectures and the table is empty or the database is uninitialized, the query throws an exception instead of returning an empty array.

---

#### Test TC005 Visit the home page and open the lectures directory
- **Test Code:** [TC005_Visit_the_home_page_and_open_the_lectures_directory.py](./TC005_Visit_the_home_page_and_open_the_lectures_directory.py)
- **Test Error:** TEST BLOCKED: The home page cannot be used to discover featured content because the site is returning a server-side application error.
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/cdcf124d-8220-4784-b86d-b6c623274af6)
- **Status:** ❌ Blocked
- **Severity:** HIGH
- **Analysis / Findings:** Similar to TC004, the home page crashed because the Prisma query failed to retrieve featured lectures on an uninitialized/empty table, resulting in an unhandled server-side exception.

---

#### Test TC006 Visit the home page and open the registration page
- **Test Code:** [TC006_Visit_the_home_page_and_open_the_registration_page.py](./TC006_Visit_the_home_page_and_open_the_registration_page.py)
- **Test Error:** None
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/3abd221d-acaa-4d57-96d1-ff3cc759b9e0)
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The visitor can successfully navigate from the landing page to the registration page via the header navigation.

---

#### Test TC007 Visit the home page and open the pricing page
- **Test Code:** [TC007_Visit_the_home_page_and_open_the_pricing_page.py](./TC007_Visit_the_home_page_and_open_the_pricing_page.py)
- **Test Error:** TEST BLOCKED: The home page cannot be used to discover featured content because the site is returning a server-side application error.
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/9b9cb3f0-d470-4cf7-aaad-d57854155649)
- **Status:** ❌ Blocked
- **Severity:** HIGH
- **Analysis / Findings:** Identical home page crash blocks navigation to the pricing page. The root cause is the database query exception on the home page component.

---

### Requirement: User Registration
- **Description:** Verifies registration flow and duplicate email validation.

#### Test TC008 Create a new account and continue toward sign-in
- **Test Code:** [TC008_Create_a_new_account_and_continue_toward_sign_in.py](./TC008_Create_a_new_account_and_continue_toward_sign_in.py)
- **Test Error:** TEST FAILURE: Account creation did not succeed — the registration attempt failed due to a server/database error.
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/3e364be8-f9e1-46e7-9850-d4a25d9d76e2)
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** The registration endpoint attempted to write to the database and failed. The root cause is that the local SQLite database had not been migrated to contain the necessary schema tables (or database provider was set to postgresql without a running database container), causing a database connectivity/schema error during write operations.

---

#### Test TC010 Show duplicate email validation during registration
- **Test Code:** [TC010_Show_duplicate_email_validation_during_registration.py](./TC010_Show_duplicate_email_validation_during_registration.py)
- **Test Error:** TEST BLOCKED: The UI could not perform duplicate-email validation because the server failed to reach the database.
- **Test Visualization and Result:** [View Result](https://www.testsprite.com/dashboard/mcp/tests/942a1bed-512f-4a75-98a9-f61e5c8f3857/47fc4f31-9211-4d25-862a-2b6d06371510)
- **Status:** ❌ Blocked
- **Severity:** HIGH
- **Analysis / Findings:** The server crashed with a database communication/schema error when performing the duplicate check, preventing the UI from showing validation feedback.

---

## 3️⃣ Coverage & Matching Metrics

- **40.00%** of tests passed

| Requirement | Total Tests | ✅ Passed | ❌ Failed / Blocked |
| :--- | :--- | :--- | :--- |
| Admin/User Login | 2 | 1 | 1 |
| Landing Page Navigation | 6 | 3 | 3 |
| User Registration | 2 | 0 | 2 |

---

## 4️⃣ Key Gaps / Risks

- **Database Initialization and Seeding:** The primary blocker is database environment setup. The prisma seed script has wrong fields (`password` instead of `passwordHash`, and is missing `lecturePreferences`), which halts successful local database setup.
- **Server-Side Exception Handling on Empty State:** The home page crashes with a 500 error when database tables (like courses or lectures) are empty or uninitialized. The application should handle empty table states gracefully by returning an empty list instead of throwing an unhandled exception.
- **Database Schema Sync:** SQLite requires schema sync (`npx prisma db push` or `npx prisma migrate dev`) to create all tables for user registration to work.
