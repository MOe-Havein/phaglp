import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function resetAdminPassword() {
  const email = "admin@phaglp.com"
  const newPassword = "adminpassword123"

  console.log(`Resetting password for ${email}...`)

  const hash = await bcrypt.hash(newPassword, 10)

  const updated = await prisma.user.update({
    where: { email },
    data: { passwordHash: hash },
  })

  console.log(`✓ Password updated for ${updated.email}`)
  console.log(`  New password: ${newPassword}`)
  console.log(`  Role: ${updated.role}`)

  await prisma.$disconnect()
}

resetAdminPassword().catch(console.error)
