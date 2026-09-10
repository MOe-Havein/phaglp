import { Suspense } from "react";
import { Users } from "lucide-react";
import { prisma, serializePrisma } from "@/lib/prisma";
import { AddUserDialog } from "@/components/control/add-user-dialog";
import { EditUserDialog } from "@/components/control/edit-user-dialog";

export const metadata = {
  title: "User Management — PHAGLP Control",
};

async function getUsersData() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tier: true,
        createdAt: true,
        image: true,
        firstName: true,
        fatherName: true,
        grandfatherName: true,
        familyName: true,
        nickname: true,
        photoUrl: true,
        sex: true,
        birthDate: true,
        birthCountry: true,
        birthState: true,
        birthCity: true,
        birthTown: true,
        birthVillage: true,
        incomeLevel: true,
        worldTier: true,
        mobile1: true,
        mobile2: true,
        telephone: true,
        educationLevel: true,
        educationDegree: true,
        educationSchool: true,
        educationPhoto: true,
        iqLevel: true,
        nationalityId: true,
        nationalityPhoto: true,
        residenceState: true,
        residenceCity: true,
        residenceTown: true,
        residenceNo: true,
        residencePhoto: true,
        homeUnit: true,
        homeBuilding: true,
        homeStreet: true,
        homeCity: true,
        homeState: true,
        homeCountry: true,
        jobTitle: true,
        jobIncome: true,
        jobOrganization: true,
        jobCountry: true,
        guardianName: true,
        guardianMobile: true,
        guardianEmail: true,
        guardianResidence: true,
        guardianIncome: true,
      },
    });
    return serializePrisma(users);
  } catch {
    return [];
  }
}

async function UsersTable() {
  const users = await getUsersData();
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Role
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Tier
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Joined
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No users found</p>
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : user.role === "INSTRUCTOR"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                    {user.tier}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <EditUserDialog user={user} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {users.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Management</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage platform members, roles, and tiers.
          </p>
        </div>
        <AddUserDialog />
      </div>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <UsersTable />
      </Suspense>
    </div>
  );
}
