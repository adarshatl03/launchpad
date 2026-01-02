import { Skeleton } from "@/components/ui/Skeleton";

export function PlanCardSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
      <div className="space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Status and Step */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Date */}
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function PlanListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </div>
  );
}
