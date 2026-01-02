"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Timeline, Milestone } from "@/components/wizard/Timeline";
import { updatePlanStep } from "@/lib/actions/planActions";
import { PlanInputs } from "@/types/plan";

interface Step3FormProps {
  planId?: string;
  initialData?: PlanInputs;
  generatedRoadmap: Milestone[];
}

export default function Step3Form({
  planId,
  initialData,
  generatedRoadmap,
}: Step3FormProps) {
  // Server Action
  const handleNext = async (_state: unknown, _formData: FormData) => {
    if (!planId) return { error: "Plan ID missing" };
    // No inputs to save here, just progress update
    return updatePlanStep(planId, 4, {});
  };

  const [state, action, isPending] = useActionState(handleNext, null);

  const backHref = planId
    ? `/dashboard/new/step-2?planId=${planId}`
    : "/dashboard/new/step-2";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">
            Execution Roadmap
          </h2>
          <p className="text-sm text-neutral-400">
            A generated timeline based on your selected features and complexity
            score.
          </p>
        </div>
        <Button
          variant="outline"
          className="hidden md:flex border-neutral-700 text-neutral-300 hover:text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 md:p-8">
        <Timeline milestones={generatedRoadmap} />
      </div>

      <form
        action={action}
        className="flex justify-between pt-4 border-t border-neutral-800"
      >
        {state?.error && (
          <div className="hidden text-red-500">{state.error}</div>
        )}

        <Button variant="ghost" asChild type="button">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-white text-black hover:bg-neutral-200"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Next: Tech Stack
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
