import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function testLogin() {
  const email = "admin@moe.com"
  const password = "adminpassword123"

  console.log("Testing login for:", email)

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.log("❌ User not found!")
    return
  }

  console.log("✓ User found:", user.email, user.role)
  console.log("Stored hash:", user.passwordHash)

  // Test password
  const isValid = await bcrypt.compare(password, user.passwordHash)
  console.log(
    `\n${isValid ? "✓" : "❌"} Password "${password}" is ${isValid ? "VALID" : "INVALID"}`,
  )

  // Also test with wrong password
  const isValidWrong = await bcrypt.compare("wrongpassword", user.passwordHash)
  console.log(
    `${isValidWrong ? "✓" : "❌"} Password "wrongpassword" is ${isValidWrong ? "VALID" : "INVALID"} (should be invalid)`,
  )

  await prisma.$disconnect()
}

testLogin().catch(console.error)
