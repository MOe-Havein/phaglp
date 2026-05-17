import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // Clean up existing data in core tables only
  try {
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
    await prisma.session.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.courseModule.deleteMany()
    await prisma.course.deleteMany()
    await prisma.lectureRevision.deleteMany()
    await prisma.lecture.deleteMany()
    await prisma.user.deleteMany()
    console.log("Cleaned up previous data.")
  } catch (error) {
    console.log("Note: Some cleanup operations may have failed, continuing with seeding...")
  }

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10)
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@moe",
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  })
  console.log(`Created admin user: ${adminUser.email}`)

  // Create Instructor User
  const instructorPasswordHash = await bcrypt.hash("instructor123", 10)
  const instructor = await prisma.user.create({
    data: {
      email: "instructor@example.com",
      name: "Prof. Socrates",
      passwordHash: instructorPasswordHash,
      role: Role.INSTRUCTOR,
    },
  })
  console.log(`Created instructor user: ${instructor.email}`)

  // Create Sample Users
  const user1PasswordHash = await bcrypt.hash("userpassword123", 10)
  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
      passwordHash: user1PasswordHash,
    },
  })

  const user2PasswordHash = await bcrypt.hash("userpassword456", 10)
  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
      passwordHash: user2PasswordHash,
    },
  })
  console.log(`Created sample users: ${user1.email}, ${user2.email}`)



  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
