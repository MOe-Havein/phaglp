import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().catch("postgresql://dummy:dummy@localhost:5432/dummy"),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  // Add other required env vars here
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
