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

  // --- Create Sample Lectures ---
  const lecture1 = await prisma.lecture.create({
    data: {
      title: "The Socratic Method",
      slug: "the-socratic-method",
      body: "The Socratic method, also known as method of Elenchus, elenctic method, or Socratic debate, is a form of cooperative argumentative dialogue between individuals, based on asking and answering questions to stimulate critical thinking and to draw out ideas and underlying presuppositions.",
      excerpt: "An introduction to the foundational method of Western philosophy.",
      category: "Methodology",
      published: true,
      authorId: adminUser.id,
      isFeatured: true,
      tags: ["Socrates", "Ancient Greece", "Dialogue"],
    },
  })

  const lecture2 = await prisma.lecture.create({
    data: {
      title: "Introduction to Metaphysics",
      slug: "intro-to-metaphysics",
      body: "Metaphysics is the branch of philosophy that examines the fundamental nature of reality, including the relationship between mind and matter, between substance and attribute, and between potentiality and actuality.",
      excerpt: "Exploring the nature of reality and existence.",
      category: "Metaphysics",
      published: true,
      authorId: adminUser.id,
      tags: ["Reality", "Existence", "Philosophy"],
    },
  })
  console.log("Created sample lectures.")

  // --- Create Sample Courses ---
  const course1 = await prisma.course.create({
    data: {
      title: "Ancient Greek Philosophy",
      slug: "ancient-greek-philosophy",
      description: "Dive deep into the origins of Western thought with an exploration of Pre-Socratic thinkers, Socrates, Plato, and Aristotle.",
      price: 49.99,
      duration: "10 hours",
      published: true,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "The Pre-Socratics",
            order: 1,
            lessons: {
              create: [
                { title: "Thales and the First Principles", order: 1, content: "Water is the origin of all things." },
                { title: "Heraclitus and Flux", order: 2, content: "You cannot step into the same river twice." },
              ],
            },
          },
          {
            title: "Socrates and the Golden Age",
            order: 2,
            lessons: {
              create: [
                { title: "The Trial of Socrates", order: 1, content: "The unexamined life is not worth living." },
                { title: "Plato's Allegory of the Cave", order: 2, content: "Shadows on the wall vs. reality." },
              ],
            },
          },
        ],
      },
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: "Ethics in the Modern Age",
      slug: "ethics-modern-age",
      description: "How do we apply traditional ethical frameworks to contemporary problems like AI, climate change, and global justice?",
      price: 29.99,
      duration: "6 hours",
      published: true,
      instructorId: adminUser.id,
      modules: {
        create: [
          {
            title: "Foundations of Ethics",
            order: 1,
            lessons: {
              create: [
                { title: "Utilitarianism vs. Deontology", order: 1, content: "The greatest good for the greatest number vs. duty-based ethics." },
              ],
            },
          },
        ],
      },
    },
  })
  console.log("Created sample courses.")

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

  // Create Sample Analytics
  await prisma.analytics.createMany({
    data: [
      { event: "PAGE_VIEW", path: "/", userId: user1.id },
      { event: "PAGE_VIEW", path: "/blog", userId: user2.id },
      { event: "LOGIN", path: "/login", userId: adminUser.id },
      { event: "SIGNUP", path: "/register", metadata: { method: "credentials" } },
    ],
  })
  console.log("Created sample analytics data.")

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
