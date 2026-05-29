import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  // 💡 الحل القاطع: تمرير المتغير السري هنا لضمان حقنه في كل مسارات التطبيق والـ Middleware
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default-secret",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnControl = nextUrl.pathname.startsWith("/control")
      const userRole = auth?.user?.role

      if (isOnControl) {
        if (isLoggedIn && userRole === "ADMIN") return true
        return false // Redirect to login
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.tier = (user as any).tier
        token.id = user.id as string
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as any
        session.user.tier = token.tier as any
      }
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
