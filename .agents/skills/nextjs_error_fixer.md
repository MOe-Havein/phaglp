# Name: Next.js 15 & TypeScript Self-Healing Error Fixer (agy agent)
# Description: Automatically intercepts and resolves Next.js, React 19, TypeScript compiler, Prisma, and Tailwind compilation and runtime errors.

## Activation Trigger
- Triggered whenever a compilation command, development build, or TypeScript validation (`tsc` or `npm run build`) fails, or when runtime stack traces and logs indicate errors.

## Target Error Classes & Protocols

### 1. Missing Files and Dependencies
- **Issue Identification**: Matches errors containing `Cannot find module '<package>'` or `Could not resolve '<package>'`.
- **Protocol**:
  - Check for lockfiles in the root: `pnpm-lock.yaml` indicates a `pnpm` workspace, while `package-lock.json` indicates `npm`.
  - Execute dependency installation: Run `pnpm add <package>` or `npm install <package>` based on the active package manager.
  - For missing local files (e.g., `./components/my-component`), check the project directory structure and create a basic skeleton component if the file is missing.

### 2. Code Syntax and Formatting Issues
- **Issue Identification**: Matches syntax errors, missing brackets, unclosed tags, or eslint formatting warnings.
- **Protocol**:
  - Pinpoint the exact line number and file path from the compile log.
  - Read the surrounding 20 lines of context.
  - Rectify unclosed JSX/TSX tags, mismatched brackets, or trailing comma syntax errors.
  - Apply clean formatting aligned with Prettier guidelines.

### 3. Runtime Errors and Bugs
- **Issue Identification**: Matches server-side errors, database connection exceptions, or Server Action redirect failures.
- **Protocol**:
  - **Prisma Connection**: If database connection exceptions are thrown, verify the PostgreSQL container is active and `DATABASE_URL` is set in the environment.
  - **Server Actions & Redirects**: In Next.js 15, `redirect()` throws a special routing error. Ensure any `redirect()` calls are placed *outside* try-catch blocks or that redirect errors are programmatically re-thrown using `isRedirectError` checks.
  - **RSC vs Client Components**: If an error references hooks (`useState`, `useEffect`, `useContext`) in a Server Component, prepend `'use client'` to the file.

### 4. Import and Export Problems
- **Issue Identification**: Matches mismatched exports, e.g., `does not contain a default export` or `is not exported by`.
- **Protocol**:
  - Check the target import statement and match it against the source file's export structure.
  - Convert `import X from '...'` to `import { X } from '...'` if the target uses named exports.
  - Verify path alias mappings (e.g., converting relative paths to `@/components/...` as defined in `tsconfig.json`).

## Core Execution Loop
1. **Analyze Diagnostic Log**: Read the full error message and stack trace.
2. **Context Inspection**: Open and view the exact files and lines referenced.
3. **Targeted Patch Application**: Rewrite the specific lines or install missing packages.
4. **Validation Test**: Run validation command (`npm run build` or the dev dev-server status check) to verify resolution.
5. **Iterative Refinement**: Repeat the fixing cycle if new compilation errors appear, up to a limit of 4 attempts.
