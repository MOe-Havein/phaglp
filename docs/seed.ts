import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // Clean up existing data
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  console.log("Cleaned up previous data.")

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10)
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  })
  console.log(`Created admin user: ${adminUser.email}`)

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

  // Create Sample Post and Comments
  const post1 = await prisma.post.create({
    data: {
      title: "Welcome to the Blog!",
      content: "This is the very first post on our new platform.",
      published: true,
      authorId: adminUser.id,
      comments: {
        create: [
          { content: "Great to be here!", authorId: user1.id },
          { content: "Looking forward to more posts.", authorId: user2.id },
        ],
      },
    },
  })
  console.log(`Created sample post "${post1.title}" with comments.`)

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
