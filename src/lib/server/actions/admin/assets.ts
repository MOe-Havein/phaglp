"use server";

import { prisma, safeDbQuery } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AssetCategory, AssetCondition, AssetStatus } from "@prisma/client";
import { requireAdmin } from "./_shared";
import type { ActionResponseState, AcademyAsset } from "@/types";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const assetSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(64),
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  description: z.string().optional().nullable(),
  category: z.nativeEnum(AssetCategory),
  condition: z.nativeEnum(AssetCondition),
  status: z.nativeEnum(AssetStatus),
  quantity: z.coerce.number().int().min(0, "Quantity must be ≥ 0"),
  quantityUnit: z.string().default("unit"),
  location: z.string().optional().nullable(),
  supplier: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  purchasePrice: z.coerce.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
});

const allocateSchema = z.object({
  userId: z.string().min(1, "User is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().optional().nullable(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFormData(formData: FormData): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  formData.forEach((value, key) => {
    out[key] = value === "" ? null : String(value);
  });
  return out;
}

// ─── CRUD Server Actions ───────────────────────────────────────────────────────

/**
 * Create a new AcademyAsset. Compatible with React 19 `useActionState`.
 */
export async function createAcademyAsset(
  _prevState: ActionResponseState,
  formData: FormData,
): Promise<ActionResponseState<AcademyAsset>> {
  try {
    await requireAdmin();
    const raw = parseFormData(formData);
    const parsed = assetSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;
    const result = await safeDbQuery(() =>
      prisma.academyAsset.create({
        data: {
          sku: data.sku,
          name: data.name,
          description: data.description ?? null,
          category: data.category,
          condition: data.condition,
          status: data.status,
          quantity: data.quantity,
          quantityUnit: data.quantityUnit,
          location: data.location ?? null,
          supplier: data.supplier ?? null,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
          purchasePrice: data.purchasePrice ?? null,
          notes: data.notes ?? null,
          courseId: data.courseId ?? null,
        },
      }),
    );

    if (result.success) {
      revalidatePath("/control/assets");
    }
    return result as ActionResponseState<AcademyAsset>;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create asset" };
  }
}

/**
 * Update an existing AcademyAsset.
 */
export async function updateAcademyAsset(
  id: string,
  _prevState: ActionResponseState,
  formData: FormData,
): Promise<ActionResponseState<AcademyAsset>> {
  try {
    await requireAdmin();
    const raw = parseFormData(formData);
    const parsed = assetSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;
    const result = await safeDbQuery(() =>
      prisma.academyAsset.update({
        where: { id },
        data: {
          sku: data.sku,
          name: data.name,
          description: data.description ?? null,
          category: data.category,
          condition: data.condition,
          status: data.status,
          quantity: data.quantity,
          quantityUnit: data.quantityUnit,
          location: data.location ?? null,
          supplier: data.supplier ?? null,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
          purchasePrice: data.purchasePrice ?? null,
          notes: data.notes ?? null,
          courseId: data.courseId ?? null,
        },
      }),
    );

    if (result.success) {
      revalidatePath("/control/assets");
      revalidatePath(`/control/assets/${id}`);
    }
    return result as ActionResponseState<AcademyAsset>;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update asset" };
  }
}

/**
 * Delete an AcademyAsset by id.
 */
export async function deleteAcademyAsset(
  id: string,
): Promise<ActionResponseState> {
  try {
    await requireAdmin();
    const result = await safeDbQuery(() =>
      prisma.academyAsset.delete({ where: { id } }),
    );
    if (result.success) {
      revalidatePath("/control/assets");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete asset" };
  }
}

/**
 * Allocate an asset to a user.
 */
export async function allocateAsset(
  assetId: string,
  _prevState: ActionResponseState,
  formData: FormData,
): Promise<ActionResponseState> {
  try {
    await requireAdmin();
    const raw = parseFormData(formData);
    const parsed = allocateSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;
    const result = await safeDbQuery(() =>
      prisma.assetAllocation.create({
        data: {
          assetId,
          userId: data.userId,
          quantity: data.quantity,
          notes: data.notes ?? null,
        },
      }),
    );

    if (result.success) {
      revalidatePath("/control/assets");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to allocate asset",
    };
  }
}

/**
 * Return all allocated units from a specific allocation record.
 */
export async function returnAllocation(
  allocationId: string,
): Promise<ActionResponseState> {
  try {
    await requireAdmin();
    const result = await safeDbQuery(() =>
      prisma.assetAllocation.update({
        where: { id: allocationId },
        data: { returnedAt: new Date() },
      }),
    );
    if (result.success) {
      revalidatePath("/control/assets");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to return allocation",
    };
  }
}
