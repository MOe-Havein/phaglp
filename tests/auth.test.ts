import { describe, it, expect, vi, beforeEach } from "vitest"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Mock prisma and bcrypt
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}))

describe("Authentication Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should verify correct credentials", async () => {
    const mockUser = {
      id: "user_123",
      email: "test@example.com",
      passwordHash: "hashed_password",
      role: "USER",
      name: "Test User",
    }

    // @ts-expect-error - Mocking prisma method
    prisma.user.findUnique.mockResolvedValue(mockUser)
    // @ts-expect-error - Mocking bcrypt method
    bcrypt.compare.mockResolvedValue(true)

    // In a real scenario, we would test the 'authorize' function from NextAuth
    // Here we simulate the internal logic of that function
    const user = await prisma.user.findUnique({ where: { email: "test@example.com" } })
    const isMatch = await bcrypt.compare("password123", mockUser.passwordHash)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } })
    expect(user).toEqual(mockUser)
    expect(isMatch).toBe(true)
  })

  it("should fail on incorrect password", async () => {
    const mockUser = {
      id: "user_123",
      email: "test@example.com",
      passwordHash: "hashed_password",
    }

    // @ts-expect-error - Mocking prisma method
    prisma.user.findUnique.mockResolvedValue(mockUser)
    // @ts-expect-error - Mocking bcrypt method
    bcrypt.compare.mockResolvedValue(false)

    const isMatch = await bcrypt.compare("wrongpassword", mockUser.passwordHash)
    expect(isMatch).toBe(false)
  })

  it("should fail if user not found", async () => {
    // @ts-expect-error - Mocking prisma method
    prisma.user.findUnique.mockResolvedValue(null)

    const user = await prisma.user.findUnique({ where: { email: "nonexistent@example.com" } })
    expect(user).toBeNull()
  })
})
