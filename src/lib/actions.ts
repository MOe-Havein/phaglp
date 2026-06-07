"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "@/lib/utils";

export async function signInWithCredentials(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const redirectTo = (data.redirectTo as string) || "/dashboard";

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo,
    });
    return { success: true };
  } catch (error: unknown) {
    // 💡 Auth.js v5 throws a redirect error to perform successful navigation.
    // We MUST re-throw all redirect errors to avoid breaking the authentication flow.
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password." };
        case "CallbackRouteError":
          return {
            success: false,
            error: "Invalid credentials or authorization failed.",
          };
        default:
          return {
            success: false,
            error: "An authentication error occurred. Please try again.",
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
