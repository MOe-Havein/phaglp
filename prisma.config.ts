import { config } from "dotenv";
import { defineConfig } from "@prisma/config";

// شحن ملف الإعدادات المحلي
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://dummy:dummy@localhost:5432/dummy", // الرابط المباشر السحابي لـ Neon أو قيمة افتراضية للبناء
  },
  migrations: {
    //#seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
