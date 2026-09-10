import { Suspense } from "react";
import { FileCode, Plus } from "lucide-react";
import Link from "next/link";
import { prisma, serializePrisma } from "@/lib/prisma";
import { DeletePageButton } from "@/components/control/delete-page-button";

export const metadata = {
  title: "Pages — PHAGLP Control",
};

async function getPages() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        author: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        _count: { select: { revisions: true } },
      },
    });
    return serializePrisma(pages);
  } catch {
    return [];
  }
}

async function PagesTable() {
  const pages = await getPages();
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Title
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Slug
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Author
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                Updated
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  <FileCode className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No pages yet</p>
                </td>
              </tr>
            ) : (
              pages.map((page: any) => (
                <tr
                  key={page.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                    {page.title}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    /{page.slug}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {page.author?.name ?? "System"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        page.published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}
                    >
                      {page.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/control/pages/${page.id}`}
                        className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeletePageButton id={page.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pages.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            {pages.length} page{pages.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export default async function PagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <FileCode className="w-4 h-4" />
            <span>CMS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Pages
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage site content pages.
          </p>
        </div>
        <Link
          href="/control/pages/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <PagesTable />
      </Suspense>
    </div>
  );
}
