"use server";

import { prisma, safeDbQuery } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { signIn } from "@/auth";
import { isRedirectError } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "Validation failed",
      };
    }

    const { name, email, password } = parsed.data;

    const result = await safeDbQuery(async () => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      return prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: Role.USER,
          lecturePreferences: [],
        },
      });
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: { registered: true, email },
    };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Registration error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }
}

function sanitizeRedirect(redirectTo?: string): string {
  const target = redirectTo ?? "/dashboard";
  if (!target.startsWith("/")) {
    return "/dashboard";
  }
  if (target.startsWith("//")) {
    return "/dashboard";
  }
  return target;
}

export async function signInWithCredentials(input: {
  email: string;
  password: string;
  redirectTo?: string;
}) {
  try {
    await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirectTo: sanitizeRedirect(input.redirectTo),
    });

    return { success: true };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message?.includes("CredentialsSignin")) {
        return { success: false, error: "Invalid email or password." };
      }

      if (error.message?.includes("CallbackRouteError")) {
        return {
          success: false,
          error: "Invalid credentials or authorization failed.",
        };
      }
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export type RegisterResult = Awaited<ReturnType<typeof registerUser>>;
export type CredentialSignInResult = Awaited<
  ReturnType<typeof signInWithCredentials>
>;
