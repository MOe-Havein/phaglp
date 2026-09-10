import { Card } from "@/components/ui/card";

interface StatsSkeletonProps {
  count?: number;
}

export function StatsSkeleton({ count = 6 }: StatsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm animate-pulse"
        >
          {/* Top accent strip placeholder */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30" />

          {/* Top Row: Icon & Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-11 w-11 rounded-xl bg-muted" />
            {i % 2 === 0 ? (
              <div className="h-5 w-16 rounded-full bg-muted/60" />
            ) : (
              <div className="h-5" />
            )}
          </div>

          {/* Detailed visual hierarchy & inner spacing */}
          <div className="space-y-2.5">
            {/* Prominent main metric block */}
            <div className="h-8 w-20 rounded-lg bg-muted" />

            {/* Header / Title block */}
            <div className="h-4 w-28 rounded-md bg-muted/60" />

            {/* Subtext/Trend indicator line */}
            <div className="h-3 w-36 rounded bg-muted/40" />
          </div>
        </Card>
      ))}
    </div>
  );
}
