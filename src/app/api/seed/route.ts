import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { courses as staticCourses } from "@/data/courses"
import { lectures as staticLectures } from "@/data/lectures"

export const dynamic = "force-dynamic"

// Custom descriptions and types for static courses to make them fit the premium design system
const coursePresets: Record<
  string,
  {
    description: string
    type: "GP_GENERAL" | "GP_GROUPS" | "GP_SUBJECTS" | "OTHER"
    duration: string
  }
> = {
  "foundations-of-stoic-wisdom": {
    description:
      "Learn ancient Stoic principles and cognitive exercises designed for elite intellectual resilience, emotional self-mastery, and clear strategic thinking.",
    type: "GP_SUBJECTS",
    duration: "4 weeks",
  },
  "applied-ethics-modern-age": {
    description:
      "A comprehensive analysis of moral dilemmas in advanced modern systems, biotechnology, artificial intelligence, and automated corporate decision structures.",
    type: "GP_GROUPS",
    duration: "8 weeks",
  },
  "cognitive-science-philosophy": {
    description:
      "Synthesize cognitive psychology, neurology, and standard epistemology to understand the structural mechanisms of human and artificial minds.",
    type: "GP_GENERAL",
    duration: "12 weeks",
  },
  "logic-critical-thinking": {
    description:
      "Master formal propositional logic, symbolic inference systems, rhetoric fallacies, and robust algorithmic verification paradigms.",
    type: "GP_SUBJECTS",
    duration: "6 weeks",
  },
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash("SuperSecret123!", 10)

    // 1. Ensure Admins exist
    const adminEmails = ["admin@example.com", "admin@moe.com"]
    const admins: any[] = []

    for (const email of adminEmails) {
      let admin = await prisma.user.findUnique({ where: { email } })
      if (!admin) {
        admin = await prisma.user.create({
          data: {
            email,
            name: "Initial Admin",
            passwordHash,
            role: "ADMIN",
            lecturePreferences: {},
          },
        })
        console.log(`Created admin: ${email}`)
      }
      admins.push(admin)
    }

    const defaultAdmin = admins[0]

    // 2. Map Instructors/Authors and ensure they exist in the DB
    const instructorsMap: Record<string, string> = {
      "Initial Admin": defaultAdmin.id,
    }

    const allInstructorNames = new Set<string>()
    staticCourses.forEach((c) => allInstructorNames.add(c.instructor))
    staticLectures.forEach((l) => allInstructorNames.add(l.author))

    for (const name of allInstructorNames) {
      if (name === "Initial Admin") continue

      const email = `${slugifyName(name)}@example.com`
      let user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            passwordHash,
            role: "INSTRUCTOR",
            lecturePreferences: {},
          },
        })
        console.log(`Created instructor user: ${name} (${email})`)
      }
      instructorsMap[name] = user.id
    }

    // 3. Seed Courses from staticCourses
    let coursesSeeded = 0
    for (const c of staticCourses) {
      const existing = await prisma.course.findUnique({ where: { slug: c.slug } })
      if (!existing) {
        const preset = coursePresets[c.slug] || {
          description:
            "An advanced academic module in modern critical inquiry and system structures.",
          type: "OTHER",
          duration: "Self-paced",
        }

        const instructorId = instructorsMap[c.instructor] || defaultAdmin.id

        await prisma.course.create({
          data: {
            title: c.title,
            slug: c.slug,
            description: preset.description,
            price: c.price,
            duration: preset.duration,
            courseType: preset.type,
            published: true, // Make visible in catalog
            instructorId,
          },
        })
        coursesSeeded++
        console.log(`Seeded course: ${c.title}`)
      }
    }

    // 4. Seed Lectures from staticLectures
    let lecturesSeeded = 0
    const lectureCoverImages: Record<string, string> = {
      "intersection-logic-experience":
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
      "stoicism-digital-age":
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
      "future-philosophical-education":
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    }

    for (const l of staticLectures) {
      const existing = await prisma.lecture.findUnique({ where: { slug: l.slug } })
      if (!existing) {
        const authorId = instructorsMap[l.author] || defaultAdmin.id
        const coverImage =
          lectureCoverImages[l.slug] ||
          "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop"

        await prisma.lecture.create({
          data: {
            title: l.title,
            slug: l.slug,
            body: l.content,
            excerpt: l.excerpt,
            category: l.category,
            published: true, // Make visible on public pages
            isFeatured: true,
            authorId,
            tags: l.tags,
            coverImage,
            readingTime: Math.max(5, Math.ceil(l.content.split(/\s+/).length / 200)),
          },
        })
        lecturesSeeded++
        console.log(`Seeded lecture: ${l.title}`)
      }
    }

    // Also seed the standard initial custom lectures if they are completely missing
    const totalLectures = await prisma.lecture.count()
    if (totalLectures === 0) {
      await prisma.lecture.create({
        data: {
          title: "Welcome to PHAGLP",
          slug: "welcome-to-phaglp",
          body: "## Welcome to the platform!\n\nThis is a sample lecture created during the seeding process.",
          excerpt: "A warm welcome to our new philosophical platform.",
          category: "General",
          published: true,
          authorId: defaultAdmin.id,
          coverImage:
            "https://images.unsplash.com/photo-1507842217121-9e8712ce62be?q=80&w=600&auto=format&fit=crop",
          tags: [],
          readingTime: 2,
        },
      })
      lecturesSeeded++
    }

    revalidatePath("/")
    revalidatePath("/courses")
    revalidatePath("/lectures")

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully! Seeded ${coursesSeeded} courses and ${lecturesSeeded} lectures.`,
      stats: {
        coursesSeeded,
        lecturesSeeded,
      },
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to seed database", details: String(error) },
      { status: 500 },
    )
  }
}
