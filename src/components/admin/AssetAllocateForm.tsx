"use client"

import { useActionState } from "react"
import { motion } from "framer-motion"
import { allocateAsset } from "@/lib/server/actions/admin/assets"
import type { ActionResponseState } from "@/types"

interface User {
  id: string
  name: string | null
  email: string
}

interface AssetAllocateFormProps {
  assetId: string
  availableQty: number
  users: User[]
  onClose?: () => void
}

const initialState: ActionResponseState = { success: false }

export function AssetAllocateForm({
  assetId,
  availableQty,
  users,
  onClose,
}: AssetAllocateFormProps) {
  const boundAction = allocateAsset.bind(null, assetId)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-5"
    >
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Allocate Asset</h3>

      {state.success && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-3 py-2"
        >
          Asset allocated successfully!
        </motion.p>
      )}

      {state.error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"
        >
          {state.error}
        </motion.p>
      )}

      <form action={formAction} className="space-y-4">
        {/* User selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assign to User <span className="text-red-500">*</span>
          </label>
          <select
            name="userId"
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">— Select user —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name ?? u.email} ({u.email})
              </option>
            ))}
          </select>
          {state.fieldErrors?.userId && (
            <p className="text-xs text-red-500 mt-1">{state.fieldErrors.userId[0]}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal ml-1">(max {availableQty})</span>
          </label>
          <input
            type="number"
            name="quantity"
            min={1}
            max={availableQty}
            defaultValue={1}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          {state.fieldErrors?.quantity && (
            <p className="text-xs text-red-500 mt-1">{state.fieldErrors.quantity[0]}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Optional notes about this allocation…"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Allocating…" : "Allocate"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  )
}
