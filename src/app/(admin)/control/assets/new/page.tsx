"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { createAcademyAsset } from "@/lib/server/actions/admin/assets";
import { AssetCategory, AssetCondition, AssetStatus } from "@prisma/client";
import type { ActionResponseState } from "@/types";

const initialState: ActionResponseState = { success: false };

const CATEGORIES = Object.values(AssetCategory);
const CONDITIONS = Object.values(AssetCondition);
const STATUSES = Object.values(AssetStatus);

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string }) {
  return (
    <input
      name={name}
      {...props}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-400"
    />
  );
}

function Select({
  name,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { name: string }) {
  return (
    <select
      name={name}
      {...props}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      {children}
    </select>
  );
}

function FieldError({ errors }: { errors?: string[] | undefined }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-red-500 mt-1">{errors[0]}</p>;
}

export default function NewAssetPage() {
  const [state, formAction, isPending] = useActionState(
    createAcademyAsset,
    initialState,
  );

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Asset Created!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          The asset was added to the inventory.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            Add Another
          </button>
          <Link
            href="/control/assets"
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View All Assets
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/control/assets"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Assets
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          New Asset
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add a new item to the academy inventory.
        </p>
      </div>

      {state.error && !state.fieldErrors && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </motion.div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>SKU</Label>
              <Input name="sku" placeholder="e.g. CAM-001" required />
              <FieldError errors={state.fieldErrors?.sku} />
            </div>
            <div>
              <Label required>Name</Label>
              <Input name="name" placeholder="Asset name" required />
              <FieldError errors={state.fieldErrors?.name} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              rows={3}
              placeholder="Optional description…"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label required>Category</Label>
              <Select name="category" defaultValue="OTHER">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </Select>
              <FieldError errors={state.fieldErrors?.category} />
            </div>
            <div>
              <Label required>Condition</Label>
              <Select name="condition" defaultValue="GOOD">
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label required>Status</Label>
              <Select name="status" defaultValue="AVAILABLE">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quantity & Location
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Quantity</Label>
              <Input
                name="quantity"
                type="number"
                min={0}
                defaultValue={1}
                required
              />
              <FieldError errors={state.fieldErrors?.quantity} />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                name="quantityUnit"
                placeholder="unit"
                defaultValue="unit"
              />
            </div>
          </div>

          <div>
            <Label>Storage Location</Label>
            <Input name="location" placeholder="e.g. Room A3, Shelf B2" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Procurement
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Supplier</Label>
              <Input name="supplier" placeholder="Supplier name" />
            </div>
            <div>
              <Label>Purchase Price</Label>
              <Input
                name="purchasePrice"
                type="number"
                step="0.01"
                min={0}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label>Purchase Date</Label>
            <Input name="purchaseDate" type="date" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/control/assets"
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
          >
            {isPending ? "Creating..." : "Create Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
