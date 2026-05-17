export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      JWT_SECRET: string
      NEXTAUTH_URL: string
      NODE_ENV: "development" | "production" | "test"
    }
  }

  interface UserSession {
    id: string
    email: string
    name?: string | null
    role: "USER" | "ADMIN" | "INSTRUCTOR"
  }
}
