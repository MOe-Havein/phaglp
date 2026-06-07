import prisma from "@/lib/prisma";

async function diagnose() {
  console.log("=== Database Diagnostic ===\n");

  // Check connection
  try {
    await prisma.$connect();
    console.log("✓ Prisma connected successfully");
  } catch (error) {
    console.log("✗ Failed to connect:", error);
    return;
  }

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  console.log(`\nFound ${users.length} users in database:`);
  users.forEach((user) => {
    console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`);
  });

  // Check specifically for admin
  const admin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  console.log("\nAdmin user lookup:");
  if (admin) {
    console.log("✓ admin@example.com EXISTS");
    console.log("  ID:", admin.id);
    console.log("  Name:", admin.name);
    console.log("  Role:", admin.role);
  } else {
    console.log("✗ admin@example.com NOT FOUND");
  }

  await prisma.$disconnect();
}

diagnose().catch(console.error);
