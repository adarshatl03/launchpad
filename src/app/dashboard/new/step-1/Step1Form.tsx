"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Save, Loader2 } from "lucide-react";
import { createPlan, updatePlanStep } from "@/lib/actions/planActions";
import { PlanInputs } from "@/types/plan";

interface Step1FormProps {
  planId?: string;
  initialData?: PlanInputs; // Data loaded from server
}

export default function Step1Form({ planId, initialData }: Step1FormProps) {
  const handleSave = async (prevState: unknown, formData: FormData) => {
    const rawData = {
      problemStatement: formData.get("problem") as string,
      targetUser: formData.get("user") as string,
      valueProposition: formData.get("value") as string,
      nonGoals: formData.get("nonGoals") as string,
    };

    if (!planId) {
      // Create new
      formData.append("title", rawData.problemStatement.slice(0, 50) + "...");
      return createPlan(prevState, formData);
    } else {
      // Update existing (and move to next step)
      return updatePlanStep(planId, 2, rawData);
    }
  };

  const [state, action, isPending] = useActionState(handleSave, null);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Idea Clarifier</h2>
        <p className="text-sm text-neutral-400">
          Describe the core of your product. Be specific.
        </p>
      </div>

      <form action={action} className="space-y-8">
        {state?.error && (
          <div className="p-3 rounded bg-red-900/50 border border-red-800 text-red-200 text-sm">
            Error: {state.error}
          </div>
        )}

        {/* Problem Statement */}
        <div className="space-y-2">
          <label
            htmlFor="problem"
            className="block text-sm font-medium text-white"
          >
            What problem are you solving?
          </label>
          <textarea
            id="problem"
            name="problem"
            rows={3}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="e.g. Remote teams struggle to track asynchronous decisions..."
            required
            defaultValue={initialData?.problemStatement}
          />
        </div>

        {/* Target User */}
        <div className="space-y-2">
          <label
            htmlFor="user"
            className="block text-sm font-medium text-white"
          >
            Who is this for? (Target Audience)
          </label>
          <input
            type="text"
            id="user"
            name="user"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="e.g. Product Managers in mid-sized tech companies"
            required
            defaultValue={initialData?.targetUser}
          />
        </div>

        {/* Value Proposition */}
        <div className="space-y-2">
          <label
            htmlFor="value"
            className="block text-sm font-medium text-white"
          >
            What is the core value proposition?
          </label>
          <textarea
            id="value"
            name="value"
            rows={2}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="e.g. A central decision log that integrates with Slack..."
            required
            defaultValue={initialData?.valueProposition}
          />
        </div>

        {/* Non-Goals (Rule Enforced) */}
        <div className="rounded-md border border-red-900/50 bg-red-950/10 p-4">
          <div className="space-y-2">
            <label
              htmlFor="nonGoals"
              className="block text-sm font-medium text-red-200"
            >
              What are you NOT building? (Non-Goals)
            </label>
            <p className="text-xs text-red-300/70">
              Crucial for MVP. List features you are explicitly excluding.
            </p>
            <textarea
              id="nonGoals"
              name="nonGoals"
              rows={2}
              className="w-full rounded-md border border-red-900/50 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
              placeholder="e.g. Mobile app, Offline mode, Real-time collaboration cursor..."
              required
              defaultValue={initialData?.nonGoals}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            className="border-neutral-700 text-neutral-300 hover:text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
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
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
