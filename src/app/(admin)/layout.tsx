import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { ControlSidebar } from "@/components/control/ControlSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <ControlSidebar userName={session.user.name ?? null} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-screen-2xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
