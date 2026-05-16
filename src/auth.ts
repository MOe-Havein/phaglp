import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import prisma from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { Role, SubscriptionTier } from "@prisma/client"

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  secret: authConfig.secret,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("[Auth] Authorize attempt for:", credentials?.email)
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          console.log("[Auth] Parsed email:", email)

          try {
            const user = await prisma.user.findUnique({
              where: { email },
            })

            if (!user) {
              console.log("[Auth] User not found in DB:", email)
              return null
            }

            if (!user.passwordHash) {
              console.log("[Auth] User has no password hash:", email)
              return null
            }

            console.log("[Auth] Comparing passwords...")
            const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
            console.log("[Auth] Password match result:", passwordsMatch)

            if (passwordsMatch) {
              console.log("[Auth] Login successful for:", email)
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tier: user.tier,
              }
            } else {
              console.log("[Auth] Password mismatch for:", email)
            }
          } catch (dbError) {
            console.error("[Auth] Database error during authorize:", dbError)
            throw dbError
          }
        } else {
          console.log("[Auth] Credential validation failed:", parsedCredentials.error.flatten())
        }

        console.log("[Auth] Authorization failed for:", credentials?.email)
        return null
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tier = user.tier
        token.id = user.id as string
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.tier = token.tier as SubscriptionTier
      }
      return session
    },
  },
})
