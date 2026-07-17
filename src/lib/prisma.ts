import { prisma, serializePrisma, safeDbQuery } from "@/lib/db/prisma";

/* @deprecated Use `src/lib/db/prisma.ts` directly. */
export { prisma, serializePrisma, safeDbQuery };
export default prisma;
