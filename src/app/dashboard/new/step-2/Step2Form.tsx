"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ComplexityMeter } from "@/components/wizard/ComplexityMeter";
import { cn } from "@/lib/utils";
import { updatePlanStep } from "@/lib/actions/planActions";
import { PlanInputs } from "@/types/plan";

import { FEATURE_CATEGORIES as CATEGORIES } from "@/lib/config/features";

interface Step2FormProps {
  planId?: string;
  initialData?: PlanInputs;
}

export default function Step2Form({ planId, initialData }: Step2FormProps) {
  // Initialize from saved data or empty default
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialData?.features || [],
  );

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  // Calculate Total Complexity Score
  const totalScore = CATEGORIES.flatMap((c) => c.features)
    .filter((f) => selectedFeatures.includes(f.id))
    .reduce((acc, curr) => acc + curr.cost, 0);

  const normalizedScore = Math.min(totalScore, 100);

  // Server Action Wrapper
  const handleSave = async (prevState: unknown, formData: FormData) => {
    if (!planId) return { error: "Plan ID is missing. Please start over." };

    const features = JSON.parse(formData.get("features") as string);
    const score = Number(formData.get("score"));

    return updatePlanStep(planId, 3, {
      features,
      complexityScore: score,
    });
  };

  const [state, action, isPending] = useActionState(handleSave, null);

  // Back Link Logic
  const backHref = planId
    ? `/dashboard/new/step-1?planId=${planId}`
    : "/dashboard/new/step-1";

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {state?.error && (
        <div className="col-span-full p-3 rounded bg-red-900/50 border border-red-800 text-red-200 text-sm">
          Error: {state.error}
        </div>
      )}

      {/* Hidden Inputs to pass state to Server Action */}
      <input
        type="hidden"
        name="features"
        value={JSON.stringify(selectedFeatures)}
      />
      <input type="hidden" name="score" value={normalizedScore} />

      {/* Visual Complexity Meter (Sticky Sidebar on Desktop) */}
      <div className="lg:col-span-1 order-last lg:order-last">
        <div className="sticky top-24">
          <ComplexityMeter score={normalizedScore} />
        </div>
      </div>

      {/* Main Selection Area */}
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">
            MVP Scope Builder
          </h2>
          <p className="text-sm text-neutral-400">
            Select the features required for your Minimum Viable Product. Be
            ruthless.
          </p>
        </div>

        <div className="space-y-8">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="text-md font-medium text-neutral-200 border-b border-neutral-800 pb-2">
                {category.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.features.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <div
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={cn(
                        "cursor-pointer rounded-lg border p-4 transition-all hover:border-neutral-500",
                        isSelected
                          ? "border-green-500 bg-green-500/10 text-white"
                          : "border-neutral-800 bg-neutral-900 text-neutral-400",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {feature.label}
                        </span>
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6 border-t border-neutral-800">
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
                Next: Roadmap
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
