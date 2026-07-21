"use server";

import { prisma, safeDbQuery } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role, SubscriptionTier } from "@prisma/client";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

async function ensureControlAccess() {
  const session = await auth();
  if (session?.user?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Control access required");
  }
}

export async function deleteUser(userId: string) {
  try {
    await ensureControlAccess();

    const result = await safeDbQuery(async () => {
      // 1. Nullify authorId on Page records
      await prisma.page.updateMany({
        where: { authorId: userId },
        data: { authorId: null },
      });

      // 2. Nullify userId on ChatMessage records
      await prisma.chatMessage.updateMany({
        where: { userId: userId },
        data: { userId: null },
      });

      // 3. Nullify userId on Analytics records
      await prisma.analytics.updateMany({
        where: { userId: userId },
        data: { userId: null },
      });

      // 4. Delete Sessions
      await prisma.session.deleteMany({
        where: { userId: userId },
      });

      // 6. Delete AssetAllocations
      await prisma.assetAllocation.deleteMany({
        where: { userId: userId },
      });

      // 7. Delete Comments (both authored by user and on posts authored by user)
      await prisma.comment.deleteMany({
        where: {
          OR: [{ authorId: userId }, { post: { authorId: userId } }],
        },
      });

      // 8. Delete Posts authored by the user
      await prisma.post.deleteMany({
        where: { authorId: userId },
      });

      // 9. Delete Lecture Revisions (both authored by user and belonging to lectures authored by user)
      await prisma.lectureRevision.deleteMany({
        where: {
          OR: [{ authorId: userId }, { lecture: { authorId: userId } }],
        },
      });

      // 10. Delete Lectures authored by the user
      await prisma.lecture.deleteMany({
        where: { authorId: userId },
      });

      // 11. Delete LessonProgress (both progress of the user and progress in lessons under courses instructed by user)
      await prisma.lessonProgress.deleteMany({
        where: {
          OR: [
            { userId: userId },
            { lesson: { module: { course: { instructorId: userId } } } },
          ],
        },
      });

      // 12. Delete Certificates (both owned by user and for courses instructed by user)
      await prisma.certificate.deleteMany({
        where: {
          OR: [{ userId: userId }, { course: { instructorId: userId } }],
        },
      });

      // 13. Delete Enrollments (both enrollments of user and enrollments in courses instructed by user)
      await prisma.enrollment.deleteMany({
        where: {
          OR: [{ userId: userId }, { course: { instructorId: userId } }],
        },
      });

      // 14. Delete Lessons belonging to modules of courses instructed by user
      await prisma.lesson.deleteMany({
        where: { module: { course: { instructorId: userId } } },
      });

      // 15. Delete CourseModules of courses instructed by user
      await prisma.courseModule.deleteMany({
        where: { course: { instructorId: userId } },
      });

      // 16. Delete Courses instructed by the user
      await prisma.course.deleteMany({
        where: { instructorId: userId },
      });

      // 17. Finally delete the core User record
      return prisma.user.delete({ where: { id: userId } });
    });

    if (result.success) {
      revalidatePath("/control/users");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user" };
  }
}

export async function updateSiteSettings(data: any) {
  try {
    await ensureControlAccess();

    const result = await safeDbQuery(async () => {
      return prisma.siteSettings.upsert({
        where: { id: "global" },
        update: {
          siteName: data.siteName,
          siteUrl: data.siteUrl,
          description: data.description,
          maintenanceMode: data.maintenanceMode,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          enableAdminTheme: data.enableAdminTheme,
          adminPrimaryColor: data.adminPrimaryColor,
          adminSecondaryColor: data.adminSecondaryColor,
          adminBackgroundColor: data.adminBackgroundColor,
          adminTextColor: data.adminTextColor,
          fullAddress: data.fullAddress,
          allowRegistration: data.allowRegistration ?? true,
        },
        create: {
          id: "global",
          siteName: data.siteName,
          siteUrl: data.siteUrl,
          description: data.description,
          maintenanceMode: data.maintenanceMode,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          enableAdminTheme: data.enableAdminTheme,
          adminPrimaryColor: data.adminPrimaryColor,
          adminSecondaryColor: data.adminSecondaryColor,
          adminBackgroundColor: data.adminBackgroundColor,
          adminTextColor: data.adminTextColor,
          fullAddress: data.fullAddress,
          allowRegistration: data.allowRegistration ?? true,
        },
      });
    });

    if (result.success) {
      revalidatePath("/control/settings");
      revalidatePath("/");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update settings",
    };
  }
}

export async function toggleFeatureFlag(key: string, isEnabled: boolean) {
  try {
    await ensureControlAccess();
    const result = await safeDbQuery(async () => {
      return prisma.featureFlag.upsert({
        where: { key },
        update: { isEnabled },
        create: { key, isEnabled },
      });
    });

    if (result.success) {
      revalidatePath("/control/settings");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to toggle feature flag",
    };
  }
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    await ensureControlAccess();
    const result = await safeDbQuery(async () => {
      return prisma.user.update({
        where: { id: userId },
        data: { role },
      });
    });

    if (result.success) {
      revalidatePath("/control/users");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update user role",
    };
  }
}

export async function updateUserTier(userId: string, tier: SubscriptionTier) {
  try {
    await ensureControlAccess();
    const result = await safeDbQuery(async () => {
      return prisma.user.update({
        where: { id: userId },
        data: { tier },
      });
    });

    if (result.success) {
      revalidatePath("/control/users");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update user tier",
    };
  }
}

import {
  Sex,
  IncomeLevel,
  WorldTier,
  EducationLevel,
  IQLevel,
} from "@prisma/client";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.nativeEnum(Role),
  tier: z.nativeEnum(SubscriptionTier).optional(),

  // Extended fields
  firstName: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  grandfatherName: z.string().optional().nullable(),
  familyName: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  sex: z.nativeEnum(Sex).optional().nullable(),
  birthDate: z.string().optional().nullable(),
  birthCountry: z.string().optional().nullable(),
  birthState: z.string().optional().nullable(),
  birthCity: z.string().optional().nullable(),
  birthTown: z.string().optional().nullable(),
  birthVillage: z.string().optional().nullable(),
  incomeLevel: z.nativeEnum(IncomeLevel).optional().nullable(),
  worldTier: z.nativeEnum(WorldTier).optional().nullable(),
  mobile1: z.string().optional().nullable(),
  mobile2: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  educationLevel: z.nativeEnum(EducationLevel).optional().nullable(),
  educationDegree: z.string().optional().nullable(),
  educationSchool: z.string().optional().nullable(),
  educationPhoto: z.string().optional().nullable(),
  iqLevel: z.nativeEnum(IQLevel).optional().nullable(),
  nationalityId: z.string().optional().nullable(),
  nationalityPhoto: z.string().optional().nullable(),
  residenceState: z.string().optional().nullable(),
  residenceCity: z.string().optional().nullable(),
  residenceTown: z.string().optional().nullable(),
  residenceNo: z.string().optional().nullable(),
  residencePhoto: z.string().optional().nullable(),
  homeUnit: z.string().optional().nullable(),
  homeBuilding: z.string().optional().nullable(),
  homeStreet: z.string().optional().nullable(),
  homeCity: z.string().optional().nullable(),
  homeState: z.string().optional().nullable(),
  homeCountry: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  jobIncome: z.string().optional().nullable(),
  jobOrganization: z.string().optional().nullable(),
  jobCountry: z.string().optional().nullable(),
  guardianName: z.string().optional().nullable(),
  guardianMobile: z.string().optional().nullable(),
  guardianEmail: z.string().optional().nullable(),
  guardianResidence: z.string().optional().nullable(),
  guardianIncome: z.nativeEnum(IncomeLevel).optional().nullable(),
});

export async function createUser(data: z.infer<typeof userSchema>) {
  try {
    await ensureControlAccess();

    const validated = userSchema.parse(data);

    if (!validated.password) {
      return { success: false, error: "Password is required for new users" };
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const result = await safeDbQuery(async () => {
      return prisma.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          passwordHash,
          role: validated.role,
          tier: validated.tier ?? SubscriptionTier.BASIC,
          lecturePreferences: [],
        },
      });
    });

    if (result.success) {
      revalidatePath("/control/users");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user" };
  }
}

export async function updateUser(
  userId: string,
  data: Partial<z.infer<typeof userSchema>>,
) {
  try {
    await ensureControlAccess();

    const validated = userSchema.partial().parse(data);

    const updateData: any = {
      name: validated.name,
      email: validated.email,
      role: validated.role,
    };

    if (validated.tier) {
      updateData.tier = validated.tier;
    }

    if (validated.password) {
      updateData.passwordHash = await bcrypt.hash(validated.password, 10);
    }

    // Extended profile fields
    const extendedFields = [
      "firstName",
      "fatherName",
      "grandfatherName",
      "familyName",
      "nickname",
      "photoUrl",
      "sex",
      "birthCountry",
      "birthState",
      "birthCity",
      "birthTown",
      "birthVillage",
      "incomeLevel",
      "worldTier",
      "mobile1",
      "mobile2",
      "telephone",
      "educationLevel",
      "educationDegree",
      "educationSchool",
      "educationPhoto",
      "iqLevel",
      "nationalityId",
      "nationalityPhoto",
      "residenceState",
      "residenceCity",
      "residenceTown",
      "residenceNo",
      "residencePhoto",
      "homeUnit",
      "homeBuilding",
      "homeStreet",
      "homeCity",
      "homeState",
      "homeCountry",
      "jobTitle",
      "jobIncome",
      "jobOrganization",
      "jobCountry",
      "guardianName",
      "guardianMobile",
      "guardianEmail",
      "guardianResidence",
      "guardianIncome",
    ];

    extendedFields.forEach((field) => {
      if ((validated as any)[field] !== undefined) {
        updateData[field] = (validated as any)[field];
      }
    });

    if (validated.birthDate) {
      updateData.birthDate = new Date(validated.birthDate);
    } else if (validated.birthDate === null) {
      updateData.birthDate = null;
    }

    const result = await safeDbQuery(async () => {
      return prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    });

    if (result.success) {
      revalidatePath("/control/users");
      revalidatePath("/courses");
      revalidatePath("/dashboard");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user" };
  }
}

export async function getControlAnalytics() {
  try {
    await ensureControlAccess();

    return await safeDbQuery(async () => {
      const [userCount, courseCount, lectureCount] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.lecture.count(),
      ]);

      return {
        userCount,
        courseCount,
        lectureCount,
      };
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch analytics",
    };
  }
}

export async function getRecentAnalytics(limit = 10) {
  try {
    await ensureControlAccess();

    return await safeDbQuery(async () => {
      return prisma.analytics.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch recent analytics",
    };
  }
}

export async function trackAnalytics(
  event: string,
  path?: string,
  metadata?: any,
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    return await safeDbQuery(async () => {
      return prisma.analytics.create({
        data: {
          event,
          path,
          metadata: metadata || {},
          userId,
        } as any,
      });
    });
  } catch (error) {
    console.error("Failed to track analytics:", error);
    return { success: false, error: "Failed to track analytics" };
  }
}
