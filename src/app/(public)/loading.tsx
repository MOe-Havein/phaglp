import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-4xl space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full md:w-3/4 mx-auto" />
            <Skeleton className="h-12 w-1/2 mx-auto" />
          </div>
          <Skeleton className="h-20 w-full mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center mb-12">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
