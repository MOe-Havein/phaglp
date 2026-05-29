import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // 1. Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      siteName: 'PHAGLP Platform',
      siteUrl: 'http://localhost:3000',
      metaTitle: 'The Philosophical Academy Platform',
      metaDescription: 'High-performance Next.js 15 app architecture.',
      description: 'Unified Dashboard Management Engine.',
      maintenanceMode: false,
      primaryColor: '#3b82f6',
    },
  });

  // 2. Seed Default Navigation Menu
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
      type: 'hero',
      title: 'Architectures Restructured',
      body: 'This homepage configuration layout is synchronized natively via local SQLite structures.',
      visible: true,
      order: 1,
    },
  });

  // 4. Seed admin@moe.com
  const hashedMoe = await bcrypt.hash('adminpassword123', 10);
  const adminMoe = await prisma.user.upsert({
    where: { email: 'admin@moe.com' },
    update: {
      role: 'ADMIN',
      passwordHash: hashedMoe,
    },
    create: {
      email: 'admin@moe.com',
      name: 'Moe Admin',
      passwordHash: hashedMoe,
      role: 'ADMIN',
      lecturePreferences: [],
    },
  });
  console.log('✓ Seeded admin@moe.com');

  // 5. Seed admin@example.com
  const hashedExample = await bcrypt.hash('SuperSecret123!', 10);
  const adminExample = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      role: 'ADMIN',
      passwordHash: hashedExample,
    },
    create: {
      email: 'admin@example.com',
      name: 'Initial Admin',
      passwordHash: hashedExample,
      role: 'ADMIN',
      lecturePreferences: [],
    },
  });
  console.log('✓ Seeded admin@example.com');

  // 6. Seed Lectures
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
      tags: JSON.stringify(['nextjs', 'prisma']),
      published: true,
      isFeatured: true,
      authorId: adminMoe.id,
    },
  });
  console.log('✓ Seeded first lecture');

  console.log('✅ Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding broken:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
