import prisma from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function resetAdminPassword() {
  const email = "admin@moe.com";
  const newPassword = "adminpassword123";

  console.log(`Resetting password for ${email}...`);

  const hash = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.user.update({
    where: { email },
    data: { passwordHash: hash },
  });

  console.log(`✓ Password updated for ${updated.email}`);
  console.log(`  New password: ${newPassword}`);
  console.log(`  Role: ${updated.role}`);

  await prisma.$disconnect();
}

resetAdminPassword().catch(console.error);
