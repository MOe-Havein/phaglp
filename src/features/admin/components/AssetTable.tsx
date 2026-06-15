"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { deleteAcademyAsset } from "@/lib/server/actions/admin/assets";
import { cn } from "@/lib/utils";
import type { AcademyAsset } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  ALLOCATED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  MAINTENANCE:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  RETIRED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const CATEGORY_LABELS: Record<string, string> = {
  COURSE_MATERIAL: "Course Material",
  MEDIA_EQUIPMENT: "Media Equipment",
  PUBLICATION_PRINT: "Publication",
  DIGITAL_LICENSE: "Digital License",
  FURNITURE: "Furniture",
  OTHER: "Other",
};

interface AssetTableProps {
  assets: AcademyAsset[];
}

export function AssetTable({ assets }: AssetTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const filtered = assets.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchCategory =
      categoryFilter === "ALL" || a.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteAcademyAsset(id);
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ALLOCATED">Allocated</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="RETIRED">Retired</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-4 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="ALL">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <Link
          href="/control/assets/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  SKU
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                  Qty
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Location
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400">
                      <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No assets found</p>
                      <p className="text-xs mt-1">
                        Try adjusting your filters or add a new asset.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((asset, i) => (
                    <motion.tr
                      key={asset.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {asset.sku}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                        {asset.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {CATEGORY_LABELS[asset.category] ?? asset.category}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs rounded-full font-medium",
                            STATUS_COLORS[asset.status],
                          )}
                        >
                          {asset.status.charAt(0) +
                            asset.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                        {asset.quantity}
                        <span className="text-xs text-gray-400 ml-1">
                          {asset.quantityUnit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[140px] truncate">
                        {asset.location ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/control/assets/${asset.id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(asset.id, asset.name)}
                            disabled={isPending}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              {filtered.length} asset{filtered.length !== 1 ? "s" : ""} shown
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
