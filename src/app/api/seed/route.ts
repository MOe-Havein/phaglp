import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // 1. Create Admin User
    const adminEmails = ["admin@example.com", "admin@moe"]
    let adminUser

    for (const email of adminEmails) {
      const existing = await prisma.user.findUnique({
        where: { email },
      })

      if (!existing) {
        const passwordHash = await bcrypt.hash("adminpassword123", 10)
        const created = await prisma.user.create({
          data: {
            email: email,
            name: "Admin User",
            passwordHash: passwordHash,
            role: "ADMIN",
          },
        })
        console.log(`Created admin user: ${email}`)
        if (!adminUser) adminUser = created
      } else {
        console.log(`Admin user already exists: ${email}`)
        if (!adminUser) adminUser = existing
      }
    }

    // 2. Create Sample Lecture if none exist
    const lectureCount = await prisma.lecture.count()

    if (lectureCount === 0 && adminUser) {
      await prisma.lecture.create({
        data: {
          title: "Welcome to PHAGLP",
          slug: "welcome-to-phaglp",
          body: "## Welcome to the platform!\n\nThis is a sample lecture created during the seeding process. You can edit or delete this from the admin dashboard.",
          excerpt: "A warm welcome to our new philosophical platform.",
          category: "General",
          published: true,
          authorId: adminUser.id,
          coverImage:
            "https://images.unsplash.com/photo-1507842217121-9e8712ce62be?q=80&w=2676&auto=format&fit=crop", // Temporary placeholder
        },
      })

      await prisma.lecture.create({
        data: {
          title: "Preserving Human Agency in the Age of AI",
          slug: "preserving-human-agency",
          body: "## The Core Mission\n\nAs artificial intelligence becomes more integrated into our daily lives, the question of human agency becomes paramount...\n\n(This is a placeholder for your first real lecture)",
          excerpt: "Exploring the philosophical implications of AI on human free will.",
          category: "Philosophy",
          published: true,
          authorId: adminUser.id,
          coverImage:
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop", // Temporary placeholder
        },
      })

      // Additional Demo Lectures from User Request
      await prisma.lecture.create({
        data: {
          title: "The Art of Socratic Questioning in Modern Education",
          slug: "socratic-questioning-education",
          body: "## Socratic Method\n\nHow ancient Socratic methods can revolutionize modern teaching and learning approaches. It encourages critical thinking...",
          excerpt:
            "How ancient Socratic methods can revolutionize modern teaching and learning approaches.",
          category: "Education",
          published: true,
          authorId: adminUser.id,
          isFeatured: true,
          coverImage:
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2670&auto=format&fit=crop",
        },
      })

      await prisma.lecture.create({
        data: {
          title: "The Stoic Approach to Business Success",
          slug: "stoic-business",
          body: "## Stoicism in Business\n\nHow Stoic philosophy can guide ethical business practices and personal growth. Focusing on what you can control...",
          excerpt: "How Stoic philosophy can guide ethical business practices and personal growth.",
          category: "E-Commerce",
          published: true,
          authorId: adminUser.id,
          isFeatured: true,
          coverImage:
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2671&auto=format&fit=crop",
        },
      })

      revalidatePath("/")
      return NextResponse.json({ message: "Database seeded successfully with Admin and Lectures!" })
    }

    return NextResponse.json({
      message: "Database already has content. Seeding skipped for lectures, ensured Admin exists.",
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 },
    )
  }
}
