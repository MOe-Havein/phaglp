import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getPublicModelOptions } from "@/lib/ai-models";
import { configuredProviders } from "@/lib/ai-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    models: getPublicModelOptions(),
    configuredProviders: configuredProviders(),
  });
}
