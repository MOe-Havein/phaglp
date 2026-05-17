import { PrismaClient, Role, SubscriptionTier, CourseType, Sex, IncomeLevel, WorldTier } from "@prisma/client"
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
    await prisma.siteSettings.deleteMany()
    await prisma.user.deleteMany()
    console.log("Cleaned up previous data.")
  } catch (error) {
    console.log("Note: Some cleanup operations may have failed, continuing with seeding...")
  }

  // Create default SiteSettings with our address
  await prisma.siteSettings.create({
    data: {
      id: "global",
      siteName: "The Philosophical Academy for Geniuses Life Planning",
      siteUrl: "http://localhost:3000",
      metaTitle: "THE PHILOSOPHICAL ACADEMY FOR GENIUSES LIFE PLANNING",
      metaDescription: "Education, Instruction, Culture, and Life Planning for geniuses, gifted, and talented, young and adult.",
      description: "General Program of Life Planning for geniuses, gifted, and talented, young and adult. (1) Main Projects: Appropriate Education, Appropriate Work, Appropriate Marriage. (2) Supporting Projects: Consultations, Research, Comprehensive Care, General Culture.",
      primaryColor: "#3B82F6",
      fullAddress: "2501 Case Street, Unit 13, Batesville 72501, Arkansas, USA.",
    },
  })
  console.log("Created global site settings with address.")

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10)
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@moe",
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      tier: SubscriptionTier.ENTERPRISE,
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
      tier: SubscriptionTier.PRO,
    },
  })
  console.log(`Created instructor user: ${instructor.email}`)

  // Create Sample Users with specific socioeconomic conditions to test discounts
  const commonPassword = await bcrypt.hash("userpassword123", 10)

  // 1. High discount user (Low Income, Third World Country) -> Capped at 50%
  await prisma.user.create({
    data: {
      email: "poor.student@example.com",
      name: "Yusuf Al-Sudani",
      passwordHash: commonPassword,
      role: Role.USER,
      tier: SubscriptionTier.BASIC,
      firstName: "Yusuf",
      familyName: "Al-Sudani",
      sex: Sex.MALE,
      birthCountry: "Sudan",
      incomeLevel: IncomeLevel.LOW,
      worldTier: WorldTier.THIRD,
      lecturePreferences: ["Ethics", "Logic"],
    },
  })

  // 2. Medium discount user (Medium Income, Second World Country) -> 15% + 10% = 25%
  await prisma.user.create({
    data: {
      email: "med.student@example.com",
      name: "Sophia Rossi",
      passwordHash: commonPassword,
      role: Role.USER,
      tier: SubscriptionTier.PRO,
      firstName: "Sophia",
      familyName: "Rossi",
      sex: Sex.FEMALE,
      birthCountry: "Brazil",
      incomeLevel: IncomeLevel.MEDIUM,
      worldTier: WorldTier.SECOND,
      lecturePreferences: ["Metaphysics", "Logic"],
    },
  })

  // 3. No discount user (High Income, First World Country) -> 0%
  await prisma.user.create({
    data: {
      email: "rich.student@example.com",
      name: "William Vance",
      passwordHash: commonPassword,
      role: Role.USER,
      tier: SubscriptionTier.ENTERPRISE,
      firstName: "William",
      familyName: "Vance",
      sex: Sex.MALE,
      birthCountry: "USA",
      incomeLevel: IncomeLevel.HIGH,
      worldTier: WorldTier.FIRST,
      lecturePreferences: ["Science", "Metaphysics"],
    },
  })
  console.log("Created demo students with diverse socioeconomic profiles for discount logic verification.")

  // Create Sample Courses (Predefined and Custom)
  await prisma.course.create({
    data: {
      slug: "general-philosophical-integration",
      title: "GP COURSE",
      description: "Full two-year comprehensive integration tracking absolute thought methodologies, logic, and societal progression.",
      price: 300.0,
      published: true,
      instructorId: instructor.id,
      duration: "2 years",
      courseType: CourseType.GP_GENERAL,
      durationMonths: 24,
    },
  })

  await prisma.course.create({
    data: {
      slug: "peer-discourse-groups",
      title: "GP GROUPS COURSES",
      description: "Eight-month guided group program focusing on collaborative argument parsing, structured debates, and discourse.",
      price: 200.0,
      published: true,
      instructorId: instructor.id,
      duration: "8 months",
      courseType: CourseType.GP_GROUPS,
      durationMonths: 8,
    },
  })

  await prisma.course.create({
    data: {
      slug: "specialized-subjects-logic",
      title: "GP SUBJECTS COURSES",
      description: "Intense two-month deep-dive focusing exclusively on propositional calculus, syllogisms, and mathematical syntax.",
      price: 100.0,
      published: true,
      instructorId: instructor.id,
      duration: "2 months",
      courseType: CourseType.GP_SUBJECTS,
      durationMonths: 2,
    },
  })

  await prisma.course.create({
    data: {
      slug: "intro-to-epistemology",
      title: "Introduction to Epistemology",
      description: "An open elective exploring standard structures of knowledge, belief systems, and scientific validation.",
      price: 50.0,
      published: true,
      instructorId: instructor.id,
      duration: "3 weeks",
      courseType: CourseType.OTHER,
      durationMonths: 1,
    },
  })
  console.log("Created course types: General Program, Groups, Subjects, and Custom Electives.")

  // Create detailed Multilingual (Arabic/English) Lectures with tables, alignment and correct RTL pasting HTML
  const richLectureHtml = `
    <h2>The Unity of Logic & Metaphysics / وحدة المنطق والميتافيزيقا</h2>
    <p>We begin our lecture today by exploring classical syllogisms. In modern scientific philosophy, we unify semantic structures to build comprehensive models.</p>
    
    <div dir="rtl" style="text-align: right; background-color: #f8fafc; padding: 1rem; border-radius: 0.5rem; border-right: 4px solid #3b82f6;">
      <p><strong>باللغة العربية:</strong></p>
      <p>تعتبر الميتافيزيقا والمنطق وجهين لعملة واحدة في تفسير الوجود الموحد. عند نسخ هذا المحتوى من ملفات Word، يتم تطبيق التنسيق والاتجاه من اليمين إلى اليسار (RTL) بشكل تلقائي وتظهر النصوص والمصطلحات بشكل سليم تماماً.</p>
    </div>

    <p>Below is a dynamic data table summarizing logical branches which renders beautifully on the platform:</p>
    
    <table>
      <thead>
        <tr>
          <th>Branch / الفرع</th>
          <th>Primary Focus / التركيز الأساسي</th>
          <th>Syllabus Tier / المستوى الدراسي</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Formal Logic / المنطق الصوري</td>
          <td>Deductive reasoning and logical proofs / الاستدلال الاستنباطي</td>
          <td>Undergraduate / مبتدئ</td>
        </tr>
        <tr>
          <td>Metaphysics / علم ما وراء الطبيعة</td>
          <td>Nature of reality and absolute existence / طبيعة الواقع والوجود المطلق</td>
          <td>Advanced / متقدم</td>
        </tr>
      </tbody>
    </table>

    <p>Additionally, visual and multimedia elements like inline uploads and youtube embeds are fully integrated.</p>
  `

  await prisma.lecture.create({
    data: {
      slug: "unity-of-logic-metaphysics",
      title: "The Unity of Logic & Metaphysics",
      body: richLectureHtml,
      excerpt: "An advanced bilingual study investigating standard deductive structures and existence models.",
      category: "Logic",
      tags: ["Logic", "Metaphysics", "Bilingual"],
      authorId: instructor.id,
      published: true,
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
      isFeatured: true,
    },
  })

  await prisma.lecture.create({
    data: {
      slug: "applied-ethical-models",
      title: "Applied Philosophical Ethics in Technological Design",
      body: "<p>Analyzing modern algorithmic governance models using standard categorical imperatives.</p>",
      excerpt: "Investigating deontological and utilitarian paradigms in software construction.",
      category: "Ethics",
      tags: ["Ethics", "AI"],
      authorId: instructor.id,
      published: true,
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
  })
  console.log("Created bilingual lectures with RTL segments and detailed table layouts.")

  // Clean up navigation menus
  try {
    await prisma.navigationSubItem.deleteMany()
    await prisma.navigationMenu.deleteMany()
    console.log("Cleaned up previous navigation menus.")
  } catch (error) {
    console.log("Note: Navigation cleanup failed or was not needed.")
  }

  const menusData = [
    {
      name: "Main pages",
      order: 1,
      icon: "Home",
      items: [
        { name: "About us", order: 1, href: "/about-us" },
        { name: "Mission and Vision", order: 2, href: "/mission-and-vision" },
        { name: "Founder", order: 3, href: "/founder" },
        { name: "Legal info", order: 4, href: "/legal" },
        { name: "Contact", order: 5, href: "/contact" },
        { name: "FAQ", order: 6, href: "/faq" },
        { name: "Blog", order: 7, href: "/blog" },
      ],
    },
    {
      name: "Services",
      order: 2,
      icon: "Cpu",
      items: [
        { name: "Cognitive program", order: 1, href: "/services/cognitive-program" },
        { name: "Gifted training", order: 2, href: "/services/gifted-training" },
        { name: "AI Leaning Solutions", order: 3, href: "/services/ai-learning-solutions" },
        { name: "Consult", order: 4, href: "/services/consult" },
        { name: "Corporate Training", order: 5, href: "/services/corporate-training" },
      ],
    },
    {
      name: "Learning Platform",
      order: 3,
      icon: "GraduationCap",
      items: [
        { name: "Courses", order: 1, href: "/courses" },
        { name: "Learning Path", order: 2, href: "/learning-path" },
        { name: "AI Tools", order: 3, href: "/ai-tools" },
        { name: "Assessment", order: 4, href: "/assessment" },
        { name: "Certificate", order: 5, href: "/certificate" },
        { name: "Dashboard", order: 6, href: "/dashboard" },
      ],
    },
    {
      name: "Support",
      order: 4,
      icon: "LifeBuoy",
      items: [
        { name: "Support Center", order: 1, href: "/support" },
        { name: "Submit Ticket", order: 2, href: "/support/ticket" },
        { name: "Feedback", order: 3, href: "/support/feedback" },
        { name: "Documentation", order: 4, href: "/docs" },
      ],
    },
    {
      name: "Documents",
      order: 5,
      icon: "FileText",
      items: [
        { name: "Startup Costs", order: 1, href: "/documents/startup-costs" },
        { name: "Valuation Report", order: 2, href: "/documents/valuation-report" },
        { name: "Operating Agreement", order: 3, href: "/documents/operating-agreement" },
        { name: "Meeting Minutes", order: 4, href: "/documents/meeting-minutes" },
        { name: "Policies and Privacy", order: 5, href: "/privacy" },
      ],
    },
    {
      name: "Official Accounts",
      order: 6,
      icon: "Share2",
      items: [
        { name: "Facebook", order: 1, href: "https://facebook.com", isOpenNewTab: true },
        { name: "Linkedin", order: 2, href: "https://linkedin.com", isOpenNewTab: true },
        { name: "Youtube", order: 3, href: "https://youtube.com", isOpenNewTab: true },
        { name: "Instagram", order: 4, href: "https://instagram.com", isOpenNewTab: true },
      ],
    },
    {
      name: "Admin Panel",
      order: 7,
      icon: "ShieldAlert",
      items: [
        { name: "User Management", order: 1, href: "/control/users" },
        { name: "Courses Management", order: 2, href: "/control/courses" },
        { name: "Analytics", order: 3, href: "/control" },
        { name: "Finance", order: 4, href: "/control/finance" },
      ],
    },
    {
      name: "Business and Partnership",
      order: 8,
      icon: "Briefcase",
      items: [
        { name: "Agent Branches", order: 1, href: "/business/branches" },
        { name: "For Institutions", order: 2, href: "/business/institutions" },
        { name: "For Investors", order: 3, href: "/business/investors" },
        { name: "Partnerships", order: 4, href: "/business/partnerships" },
        { name: "Media Kit", order: 5, href: "/business/media-kit" },
      ],
    },
  ]

  for (const menu of menusData) {
    const createdMenu = await prisma.navigationMenu.create({
      data: {
        name: menu.name,
        order: menu.order,
        icon: menu.icon,
        isActive: true,
      },
    })
    console.log(`Created Navigation Menu: ${createdMenu.name}`)

    for (const item of menu.items) {
      await prisma.navigationSubItem.create({
        data: {
          menuId: createdMenu.id,
          name: item.name,
          order: item.order,
          href: item.href,
          isOpenNewTab: (item as any).isOpenNewTab || false,
          isActive: true,
        },
      })
    }
    console.log(`  Seeded ${menu.items.length} sub-items for ${menu.name}`)
  }

  console.log("Seeding finished successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
