import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function checkAdmin() {
  console.log("Checking for admin user...")

  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  })

  if (adminUser) {
    console.log("✓ Admin user found:", {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    })

    // Test password
    const testPassword = "adminpassword123"
    const isValid = await bcrypt.compare(testPassword, adminUser.passwordHash)
    console.log(`✓ Password "${testPassword}" is ${isValid ? "VALID" : "INVALID"}`)
  } else {
    console.log("✗ Admin user NOT found in database")
  }

  await prisma.$disconnect()
}

checkAdmin().catch(console.error)
