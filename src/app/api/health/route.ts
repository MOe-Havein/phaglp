import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withApiHandler } from "@/server/middlewares/api-handler";
export const dynamic = "force-dynamic";

export const GET = withApiHandler(async () => {
  // 1. Check Database
  const dbStart = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const dbDuration = Date.now() - dbStart;

  return NextResponse.json({
    status: "healthy",
    checks: {
      database: {
        status: "connected",
        latency: `${dbDuration}ms`,
      },
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
