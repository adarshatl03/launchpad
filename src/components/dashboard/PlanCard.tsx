import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { ProductPlan } from "@/hooks/useProductPlans";

interface PlanCardProps {
  plan: ProductPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const lastUpdated = new Date(plan.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-white/5 p-6 transition-all hover:border-white/10 hover:bg-white/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              plan.status === "completed"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-amber-500/10 text-amber-500"
            }`}
          >
            {plan.status === "completed" ? "Completed" : "Draft"}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{lastUpdated}</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors line-clamp-2">
            {plan.problem_statement || "Untitled Plan"}
          </h3>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/plan/${plan.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors"
        >
          View Plan <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
