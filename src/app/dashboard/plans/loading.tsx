import { PlanListSkeleton } from "@/components/dashboard/PlanCardSkeleton";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";

export default function PlansLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Plans</h2>
          <p className="text-neutral-400">
            Manage all your product planning projects
          </p>
        </div>
        <Button disabled className="bg-white text-black hover:bg-neutral-200">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      <PlanListSkeleton count={6} />
    </div>
  );
}
