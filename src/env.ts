import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1).catch("file:./prisma/dev2.db"),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  CLOUDINARY_URL: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(), 
  CLOUDINARY_FOLDER: z.string().min(1).optional(), 
  CLOUDINARY_PRESET: z.string().min(1).optional(), 
  // 💡 REMOVED skipValidation from inside the object schema
});

// 👇 1. Check the environment variable first before validating anything
const shouldSkipValidation = !!process.env.SKIP_ENV_VALIDATION;

// 👇 2. Run schema validation ONLY if we are not skipping it
let env = process.env as unknown as z.infer<typeof envSchema>;

if (!shouldSkipValidation) {
  const _env = envSchema.safeParse(process.env);

  if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
  }
  
  env = _env.data;
}

export { env };

