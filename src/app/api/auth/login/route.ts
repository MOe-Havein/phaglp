import { signIn } from "@/auth"
import { NextResponse } from "next/server"
import { AuthError } from "next-auth"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      // NextAuth returns an error property when credentials are invalid
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({ success: true, message: "Logged in successfully" })
  } catch (error: unknown) {
    // Re-throw Next.js redirect errors — they are expected control flow
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof (error as Record<string, unknown>).digest === "string" &&
      ((error as Record<string, unknown>).digest as string).startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        default:
          return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
