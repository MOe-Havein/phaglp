import { NextResponse } from "next/server";
import { createVercelPreviewDeployment } from "@/actions/vercel";

export async function POST() {
  const token = process.env.VERCEL_API_TOKEN || process.env.VERCEL_OIDC_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "missing VERCEL_API_TOKEN or VERCEL_OIDC_TOKEN",
      },
      { status: 500 },
    );
  }

  const result = await createVercelPreviewDeployment({});
  if (!result) {
    return NextResponse.json(
      { success: false, error: "vercel_deploy_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, deployment: result });
}
