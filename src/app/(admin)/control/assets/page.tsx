import { Suspense } from "react";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { getAssetsForAdmin } from "@/lib/server/assets";
import { AssetTable } from "@/features/admin/components/AssetTable";

export const metadata = {
  title: "Asset Inventory — PHAGLP Control",
  description: "Manage academy physical and digital assets.",
};

async function AssetsData() {
  const assets = await getAssetsForAdmin();
  return <AssetTable assets={assets} />;
}

export default async function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Package className="w-4 h-4" />
            <span>Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Academy Assets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track physical and digital inventory items.
          </p>
        </div>
        <Link
          href="/control/assets/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Asset
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <AssetsData />
      </Suspense>
    </div>
  );
}
