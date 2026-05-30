"use server"

import { prisma, safeDbQuery } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { Role } from "@prisma/client"
import { signIn } from "@/auth"
import { isRedirectError } from "@/lib/utils"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const parsed = registerSchema.safeParse(data)

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Validation failed" }
    }

    const { name, email, password } = parsed.data

    const result = await safeDbQuery(async () => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      const passwordHash = await bcrypt.hash(password, 10)

      return prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: Role.USER,
          lecturePreferences: [],
        },
      })
    })

    if (!result.success) {
      return result
    }

    // Automatically sign in after registration
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
      })
      return { success: true, data: { autoLogin: true } }
    } catch (authError) {
      if (isRedirectError(authError)) {
        throw authError
      }
      // If auto-login fails, still return success but maybe with a note
      return { success: true, data: { autoLogin: false } }
    }
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error
    }
    console.error("Registration error:", error)
    return { success: false, error: error.message || "Something went wrong. Please try again." }
  }
}
