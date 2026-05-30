import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@example.com"
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Admin already exists.")
    return
  }

  const passwordHash = await bcrypt.hash("SuperSecret123!", 10)
  await prisma.user.create({
    data: {
      email,
      name: "Initial Admin",
      passwordHash,
      role: Role.ADMIN,
      lecturePreferences: {},
    },
  })
  console.log("✅ Admin user created")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
