import prisma from "./src/lib/prisma"
import { issueCertificate } from "./src/lib/certificate-actions"

async function seedTestCertificate() {
  console.log("🌱 Starting test certificate seeding...")

  // 1. Find the admin user
  const user = await prisma.user.findFirst({
    where: { email: "admin@moe.com" },
  })

  if (!user) {
    console.error("❌ User admin@moe.com not found. Please run seed script first.")
    return
  }

  // 2. Create a test course if not exists
  const course = await prisma.course.upsert({
    where: { slug: "stoic-epistemology" },
    update: {},
    create: {
      slug: "stoic-epistemology",
      title: "Stoic Epistemology & Cognitive Reframing",
      description: "A comprehensive masterclass addressing the logical boundaries and cognitive structures of Stoicism.",
      price: 0,
      published: true,
      instructorId: user.id,
      duration: "4 weeks",
      durationMonths: 1,
    },
  })
  console.log(`✓ Verified test course: "${course.title}"`)

  // 3. Issue certificate using our new server actions
  const result = await issueCertificate(user.id, course.id, "Pass with Distinction (A+)")

  if (result.success && result.certificateCode) {
    console.log("\n🎉 Certificate Issued Successfully!")
    console.log(`  Recipient:  ${user.name} (${user.email})`)
    console.log(`  Course:     ${course.title}`)
    console.log(`  Code:       ${result.certificateCode}`)
    console.log(`\n🔗 Verification URL (run your server and open):`)
    console.log(`   http://localhost:3000/certificates/${result.certificateCode}`)
  } else {
    console.error("❌ Failed to issue certificate:", result.error)
  }

  await prisma.$disconnect()
}

seedTestCertificate().catch(console.error)
