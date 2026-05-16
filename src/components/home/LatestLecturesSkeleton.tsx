import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function LatestLecturesSkeleton() {
  return (
    <section className="py-24 px-4 bg-background animate-pulse">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl w-full">
            <div className="h-10 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4"></div>
          </div>
          <div className="h-10 bg-muted rounded w-32 hidden md:block"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col border border-primary/5 bg-background h-[350px]">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-primary/5">
                <div className="h-6 bg-muted rounded w-24"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
