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
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          console.error("Credentials validation failed:", parsedCredentials.error.format())
          return null
        }

        const { email, password } = parsedCredentials.data

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              tier: user.tier,
            }
          }
        } catch (dbError) {
          // Re-throw DB errors so Auth.js surfaces them properly
          throw dbError
        }

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
