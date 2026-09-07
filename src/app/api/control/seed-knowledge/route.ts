import { NextResponse } from "next/server";
import { seedKnowledgeBase } from "@/lib/seed-knowledge";
import { requireAdmin } from "@/lib/rbac/index";

/**
 * Admin-only endpoint to seed the knowledge base
 * Call this once to populate initial data
 */
export async function POST() {
  try {
    const isAdmin = await requireAdmin();

    // Only admins can seed the knowledge base
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    await seedKnowledgeBase();

    return NextResponse.json({
      success: true,
      message: "Knowledge base seeded successfully",
    });
  } catch (error: any) {
    console.error("Error seeding knowledge base:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed knowledge base",
      },
      { status: 500 },
    );
  }
}
