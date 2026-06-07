import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getAllCertificates } from "@/lib/certificate-actions";
import { CertificatesManager } from "@/components/admin/certificates-manager";
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certificates Registry — PHAGLP Control",
};

export default async function ControlCertificatesPage() {
  const session = await auth();
  const user = session?.user;

  // 1. Role Enforcement: Only ADMIN or INSTRUCTOR allowed
  if (!user || (user.role !== "ADMIN" && user.role !== "INSTRUCTOR")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-500/20 bg-red-50/50 dark:bg-red-950/10 p-8 text-center rounded-3xl">
          <ShieldAlert className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-red-400 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You do not have the administrative privileges required to manage
            completion certifications.
          </p>
        </Card>
      </div>
    );
  }

  // 2. Fetch all users, courses, and certificates
  const [users, courses, certificatesResult] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    getAllCertificates(),
  ]);

  const certificates =
    certificatesResult.success && certificatesResult.data
      ? certificatesResult.data
      : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <CertificatesManager
        users={users}
        courses={courses}
        initialCertificates={certificates as any}
      />
    </div>
  );
}
