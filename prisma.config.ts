import { config } from "dotenv"
import { defineConfig, env } from "@prisma/config"

// شحن ملف الإعدادات المحلي
config({ path: ".env.local" })

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"), // الرابط المباشر السحابي لـ Neon
  },
  migrations: {
    //#seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
})
