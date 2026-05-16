"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function signInWithCredentials(formData: FormData) {
  try {
    console.log("Attempting sign in with credentials Action...")
    const result = await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    })
    console.log("SignIn result:", result)
    return { success: true, data: result }
  } catch (error: any) {
    // Check for Next.js redirect error
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }

    if (error instanceof AuthError) {
      console.log("AuthError caught in Action:", error.type)
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials." }
        default:
          return { success: false, error: "Something went wrong during authentication." }
      }
    }

    console.log("Other error in Action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    }
  }
}
