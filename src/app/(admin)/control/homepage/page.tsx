import { Suspense } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { prisma, serializePrisma } from "@/lib/prisma";
import { HomepageEditor } from "@/features/admin/components/HomepageEditor";
// 🔄 REMOVED: import type { HomepageSection } from "@prisma/client";
import type { HomepageSection } from "@/types/homepage"; // 🆕 FIXED: Import your strict discriminated union type instead

export const metadata = {
  title: "Homepage CMS — PHAGLP Control",
};

// Strongly typed fetcher using parallel data fetching
async function getSections(): Promise<HomepageSection[]> {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    });
    
    // 🆕 FIXED: Force-cast serialized data to your strict custom configuration union type
    const serialized = serializePrisma(sections);
    return serialized as unknown as HomepageSection[];
  } catch (error) {
    console.error("Database connection failure in Homepage CMS:", error);
    throw new Error("Failed to load sections.");
  }
}

// Separate UI component to utilize Streaming via React Suspense
async function EditorContainer() {
  try {
    const sections = await getSections();
    return <HomepageEditor initialSections={sections} />;
  } catch {
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-200 dark:border-red-900 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p className="text-sm font-medium">Failed to load CMS layout.</p>
      </div>
    );
  }
}

// Skeleton fallback component for visual performance optimization
function EditorSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-md w-full" />
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-md w-full" />
    </div>
  );
}

export default function HomepagePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Block */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          <Home className="w-4 h-4" />
          <span>CMS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-3xl">
          Homepage
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage, sort, and publish public-facing homepage sections.
        </p>
      </div>

      {/* Suspense streaming layer */}
      <Suspense fallback={<EditorSkeleton />}>
        <EditorContainer />
      </Suspense>
    </div>
  );
}
