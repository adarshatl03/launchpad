"use client";

import { useActionState, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Save, Loader2 } from "lucide-react";
import { createPlan, updatePlanStep } from "@/lib/actions/planActions";
import { PlanInputs } from "@/types/plan";
import { useAutoSave } from "@/hooks/useAutoSave";
import { AutoSaveIndicator } from "@/components/wizard/AutoSaveIndicator";

interface Step1FormProps {
  planId?: string;
  initialData?: PlanInputs; // Data loaded from server
}

export default function Step1Form({ planId, initialData }: Step1FormProps) {
  // Form state for auto-save
  const [formData, setFormData] = useState<Partial<PlanInputs>>({
    problemStatement: initialData?.problemStatement || "",
    targetUser: initialData?.targetUser || "",
    valueProposition: initialData?.valueProposition || "",
    nonGoals: initialData?.nonGoals || "",
  });

  // Auto-save handler
  const handleAutoSave = useCallback(
    async (data: Partial<PlanInputs>) => {
      if (!planId) return; // Only auto-save for existing plans
      await updatePlanStep(planId, 1, data);
    },
    [planId],
  );

  // Auto-save hook
  const { status: autoSaveStatus } = useAutoSave({
    data: formData,
    onSave: handleAutoSave,
    delay: 500,
    enabled: !!planId, // Only enable for existing plans
  });

  const handleSave = async (prevState: unknown, formDataObj: FormData) => {
    const rawData = {
      problemStatement: formDataObj.get("problem") as string,
      targetUser: formDataObj.get("user") as string,
      valueProposition: formDataObj.get("value") as string,
      nonGoals: formDataObj.get("nonGoals") as string,
    };

    if (!planId) {
      // Create new
      formDataObj.append(
        "title",
        rawData.problemStatement.slice(0, 50) + "...",
      );
      return createPlan(prevState, formDataObj);
    } else {
      // Update existing (and move to next step)
      return updatePlanStep(planId, 2, rawData);
    }
  };

  const [state, action, isPending] = useActionState(handleSave, null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Idea Clarifier</h2>
          <p className="text-sm text-neutral-400">
            Describe the core of your product. Be specific.
          </p>
        </div>
        <AutoSaveIndicator status={autoSaveStatus} />
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
            value={formData.problemStatement}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                problemStatement: e.target.value,
              }))
            }
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
