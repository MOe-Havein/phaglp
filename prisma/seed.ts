import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('SuperSecret123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@moe.com' },
    update: {},
    create: {
      email: 'admin@moe.com',
      passwordHash: hashed,
      lecturePreferences: [],
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
