import { auth } from "@/auth";
import { ImplementationPlanClient } from "@/features/dashboard/components/implementation-plan-client";

export const metadata = {
  title: "PHAGLP — Interactive Implementation Plan",
  description:
    "Track implementation, security hardening, core features, and premium polish of the PHAGLP educational platforms dynamically.",
};

export default async function ImplementationPlanPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50/40 dark:bg-slate-950/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <ImplementationPlanClient user={session?.user} />
      </div>
    </div>
  );
}
