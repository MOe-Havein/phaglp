import prisma from "@/lib/prisma";
import {
  DollarSign,
  ShoppingBag,
  BarChart3,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SalesReportingPage() {
  // Retrieve FoxyCart transaction logs from the database
  const transactions = await prisma.foxyTransaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // Calculate statistics
  const totalOrders = transactions.length;
  const totalRevenue = transactions.reduce((acc, tx) => acc + tx.totalOrder, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Sales & Revenue Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Auditing FoxyCart checkouts and platform enrollments.
          </p>
        </div>
        <Link
          href="/control"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Panel</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="text-3xl font-extrabold text-foreground">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="text-3xl font-extrabold text-foreground">
              {totalOrders}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Avg. Order Value
            </span>
            <div className="text-3xl font-extrabold text-foreground">
              ${avgOrderValue.toFixed(2)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Purchases Log
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated in real-time</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground italic bg-slate-50/50 dark:bg-slate-900/10">
              No transactions have been recorded yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer Email</th>
                  <th className="px-6 py-4">Associated User</th>
                  <th className="px-6 py-4">Total Paid</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Purchase Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
                      {tx.foxyId}
                    </td>
                    <td className="px-6 py-4">{tx.email}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {tx.user?.name || "Unlinked User"}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-950 dark:text-gray-100">
                      ${tx.totalOrder.toFixed(2)}{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        {tx.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
