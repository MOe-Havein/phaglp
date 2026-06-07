import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyFoxySignature } from "@/lib/foxy";
import { revalidatePath } from "next/cache";
import { SubscriptionTier } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get("foxy-signature-v2") ||
      request.headers.get("x-foxy-signature");

    const secret = process.env.FOXY_API_SECRET;

    // 1. Signature Verification (if FOXY_API_SECRET is set)
    if (secret) {
      const isValid = verifyFoxySignature(rawBody, signature, secret);
      if (!isValid) {
        console.error("[Foxy Webhook] Signature verification failed");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 },
        );
      }
    } else {
      console.warn(
        "[Foxy Webhook] FOXY_API_SECRET is not configured. Signature verification bypassed.",
      );
    }

    // 2. Parse the Webhook Payload
    const payload = JSON.parse(rawBody);
    console.log(
      "[Foxy Webhook] Payload received successfully:",
      JSON.stringify(payload, null, 2),
    );

    // 3. Extract Customer and Custom Fields
    const customerEmail = payload.customer_email || payload.email;
    if (!customerEmail) {
      console.error("[Foxy Webhook] No customer email found in payload");
      return NextResponse.json(
        { error: "No customer email found" },
        { status: 400 },
      );
    }

    // Attempt to extract user_id from transaction-level custom fields
    let userId: string | null = null;
    const customFields =
      payload.custom_fields || payload._embedded?.["fx:custom_fields"] || [];
    if (Array.isArray(customFields)) {
      const userIdField = customFields.find(
        (f: any) => f.name === "user_id" || f.name === "custom_user_id",
      );
      if (userIdField) {
        userId = userIdField.value;
      }
    }

    // 4. Resolve the User
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    }

    // Fallback to looking up the user by email if we couldn't find them by ID
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: customerEmail },
      });
    }

    if (!user) {
      console.error(
        `[Foxy Webhook] User not found for email: ${customerEmail} (ID: ${userId})`,
      );
      return NextResponse.json(
        { error: "User not found in system" },
        { status: 404 },
      );
    }

    // 5. Extract purchased items
    const items = payload._embedded?.["fx:items"] || payload.items || [];

    // 4.5 Store FoxyTransaction audit log
    const foxyTransactionId =
      payload.id?.toString() || payload.transaction_id?.toString();
    if (foxyTransactionId) {
      try {
        const orderTotal = parseFloat(
          payload.total_order || payload.order_total || "0",
        );
        const currency = payload.currency || "USD";

        await prisma.foxyTransaction.upsert({
          where: { foxyId: foxyTransactionId },
          create: {
            foxyId: foxyTransactionId,
            userId: user.id,
            email: customerEmail,
            totalOrder: orderTotal,
            currency: currency,
            status: payload.status || "approved",
            itemsJson: JSON.stringify(items),
          },
          update: {
            status: payload.status || "approved",
          },
        });
        console.log(
          `[Foxy Webhook] Successfully logged transaction ${foxyTransactionId} in database`,
        );
      } catch (dbTxError) {
        console.error(
          "[Foxy Webhook] Failed to write FoxyTransaction to database:",
          dbTxError,
        );
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.warn("[Foxy Webhook] No items found in transaction");
      return NextResponse.json({
        success: true,
        message: "No items to process",
      });
    }

    const processedEnrollments: string[] = [];
    let updatedTier: SubscriptionTier | null = null;

    for (const item of items) {
      const itemCode = item.code; // Typically contains Course ID, Slug, or Subscription Tier Code
      const itemName = item.name;

      console.log(
        `[Foxy Webhook] Processing item: ${itemName} (Code: ${itemCode})`,
      );

      // Check if it's a subscription/tier upgrade
      if (itemCode === "PRO_TIER" || itemCode?.toUpperCase() === "PRO") {
        updatedTier = SubscriptionTier.PRO;
        continue;
      } else if (
        itemCode === "ENTERPRISE_TIER" ||
        itemCode?.toUpperCase() === "ENTERPRISE"
      ) {
        updatedTier = SubscriptionTier.ENTERPRISE;
        continue;
      }

      // Otherwise, assume it is a course enrollment. Try finding the course by ID first, then by slug.
      let course = await prisma.course.findUnique({
        where: { id: itemCode },
      });

      if (!course) {
        course = await prisma.course.findUnique({
          where: { slug: itemCode },
        });
      }

      if (course) {
        // Create an Enrollment record if not already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id,
            },
          },
        });

        if (!existingEnrollment) {
          await prisma.enrollment.create({
            data: {
              userId: user.id,
              courseId: course.id,
            },
          });
          console.log(
            `[Foxy Webhook] Enrolled User ${user.email} in Course ${course.title}`,
          );
          processedEnrollments.push(course.title);
          revalidatePath(`/courses/${course.slug}`);
        } else {
          console.log(
            `[Foxy Webhook] User ${user.email} is already enrolled in ${course.title}`,
          );
        }
      } else {
        console.warn(
          `[Foxy Webhook] Item code ${itemCode} did not match any course or subscription tier`,
        );
      }
    }

    // Update user subscription tier if a subscription tier item was purchased
    if (updatedTier) {
      await prisma.user.update({
        where: { id: user.id },
        data: { tier: updatedTier },
      });
      console.log(
        `[Foxy Webhook] Upgraded User ${user.email} subscription tier to ${updatedTier}`,
      );
    }

    // Revalidate dashboard to show new content
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      details: {
        userId: user.id,
        email: user.email,
        enrolledIn: processedEnrollments,
        tierUpgradedTo: updatedTier,
      },
    });
  } catch (error: any) {
    console.error("[Foxy Webhook Exception]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
