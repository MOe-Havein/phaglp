import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1).catch("file:./dev.db"),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  CLOUDINARY_URL: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(), // PHAGLP-CLOUDINARY
  CLOUDINARY_FOLDER: z.string().min(1).optional(), // blog-images
  CLOUDINARY_PRESET: z.string().min(1).optional(), // image-presets

  // Add other required env vars here
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
