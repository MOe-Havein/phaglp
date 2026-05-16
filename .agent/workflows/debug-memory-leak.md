1. Initial codebase scan for standard leak patterns (Prisma, Redis, Toasts, Async loops)
2. Add memory logging middleware or periodic logs using `process.memoryUsage()`.
3. Start the application with `NODE_OPTIONS='--inspect'`.
4. Navigate through major routes (Dashboard, Courses, Marriage Profiles).
5. Compare heap snapshots or check log growth.
6. Identify and fix root causes.
