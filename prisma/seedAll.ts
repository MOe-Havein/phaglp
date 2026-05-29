import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populating complete SQLite workspace configuration...');

  // 1. Seed Global Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      siteName: 'FreshNextJS Boilerplate',
      siteUrl: 'http://localhost:3000',
      metaTitle: 'The Philosophical Academy Platform',
      metaDescription: 'High-performance Next.js 15 app architecture.',
      description: 'Unified Dashboard Management Engine.',
      maintenanceMode: false,
      primaryColor: '#3b82f6', // 👈 Add this line to satisfy the schema validation!
    },
  });

  // 2. Seed Default Navigation Menu entries
  await prisma.navigationMenu.upsert({
    where: { id: 'nav-home' },
    update: {},
    create: {
      id: 'nav-home',
      name: 'Home',
      href: '/',
      order: 1,
      isActive: true,
      showInHeader: true,
      showInFooter: true,
    },
  });

  // 3. Seed Homepage Sections
  await prisma.homepageSection.upsert({
    where: { id: 'hero-main' },
    update: {},
    create: {
      id: 'hero-main',
      type: 'HERO',
      title: 'Architectures Restructured',
      body: 'This homepage configuration layout is synchronized natively via local SQLite structures.',
      visible: true,
      order: 1,
    },
  });

  // 4. Seed Initial Admin Account
  // (Provides fallback logic if auth queries look for a basic platform administrator)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Initial Admin',
      passwordHash: '$2b$10$x2vDuhLWV1wgdm3okQOEr.2BWcDl1J9HiO9OzjlcW6CuVcHWYT5mC', // SuperSecret123!
      role: 'ADMIN',
      lecturePreferences: {},
    },
  });

 // 5. Seed Lectures with precise field match
  await prisma.lecture.upsert({
    where: { id: 'first-lecture' },
    update: {},
    create: {
      id: 'first-lecture',
      slug: 'intro-to-nextjs15',
      title: 'Introduction to Next.js 15',
      body: 'Full lecture body text markup.',
      excerpt: 'Mastering Turbopack implementation layouts.',
      category: 'Development',
      tags: 'nextjs,prisma',
      published: true,
      isFeatured: true,
      // 👈 Connect this lecture to the admin user we just seeded above
      author: {
        connect: { email: 'admin@example.com' }
      }
    },
  });
  console.log('✅ Local database initialized and filled flawlessly!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding broken:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });