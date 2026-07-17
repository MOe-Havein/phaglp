import { z } from "zod";

const serverOnly = z.string().min(1, "Required server env missing");
const serverOpt = z.string().optional();
const publicOpt = z.string().optional();

export const env = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: serverOnly,
    AUTH_SECRET: serverOpt,
    DATABASE_URL: serverOnly,
    TURSO_AUTH_TOKEN: serverOpt,
    CLOUDINARY_URL: serverOpt,
    CLOUDINARY_CLOUD_NAME: serverOpt,
    CLOUDINARY_API_KEY: serverOpt,
    CLOUDINARY_API_SECRET: serverOpt,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: publicOpt,
    CLOUDINARY_FOLDER: serverOpt,
    CLOUDINARY_PRESET: serverOpt,
    COHERE_API_KEY: serverOpt,
    VERCEL_API_TOKEN: serverOpt,
    NEXT_PUBLIC_STATSIG_CLIENT_KEY: publicOpt,
    CONVERTKIT_API_KEY: serverOpt,
    CONVERTKIT_FORM_ID: serverOpt,
  })
  .parse(process.env);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: serverOnly,
  AUTH_SECRET: serverOpt,
  DATABASE_URL: serverOnly,
  TURSO_AUTH_TOKEN: serverOpt,
  CLOUDINARY_URL: serverOpt,
  CLOUDINARY_CLOUD_NAME: serverOpt,
  CLOUDINARY_API_KEY: serverOpt,
  CLOUDINARY_API_SECRET: serverOpt,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: publicOpt,
  CLOUDINARY_FOLDER: serverOpt,
  CLOUDINARY_PRESET: serverOpt,
  COHERE_API_KEY: serverOpt,
  VERCEL_API_TOKEN: serverOpt,
  NEXT_PUBLIC_STATSIG_CLIENT_KEY: publicOpt,
  CONVERTKIT_API_KEY: serverOpt,
  CONVERTKIT_FORM_ID: serverOpt,
});

export type Env = z.infer<typeof envSchema>;
