"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ComplexityMeter } from "@/components/wizard/ComplexityMeter";
import { CategoryToggle } from "@/components/wizard/CategoryToggle";
import { FeatureCard } from "@/components/wizard/FeatureCard";
import { updatePlanStep } from "@/lib/actions/planActions";
import { PlanInputs } from "@/types/plan";
import { useFormPersistence } from "@/hooks/useFormPersistence";

import { FEATURE_CATEGORIES as CATEGORIES } from "@/lib/config/features";

interface Step2FormProps {
  planId?: string;
  initialData?: PlanInputs;
}

export default function Step2Form({ planId, initialData }: Step2FormProps) {
  // Persistence for features
  const {
    values: selectedFeatures,
    setValues: setSelectedFeatures,
    isHydrated,
  } = useFormPersistence<string[]>(
    `plan-${planId}-features`,
    initialData?.features || [],
  );

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

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

  // Prevent flash of hydration mismatch or empty state
  if (!isHydrated) return null; // Or a skeleton

  const currentCategoryFeatures =
    CATEGORIES.find((c) => c.id === activeCategory)?.features || [];

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {state?.error && (
        <div className="col-span-full p-3 rounded bg-red-900/50 border border-red-800 text-red-200 text-sm">
          Error: {state.error}
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        type="hidden"
        name="features"
        value={JSON.stringify(selectedFeatures)}
      />
      <input type="hidden" name="score" value={normalizedScore} />

      {/* Sidebar / Meter */}
      <div className="lg:col-span-1 order-last lg:order-last">
        <div className="sticky top-24">
          <ComplexityMeter score={normalizedScore} />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">
            MVP Scope Builder
          </h2>
          <p className="text-sm text-neutral-400">
            Select the features required for your Minimum Viable Product. Use
            the toggles to explore categories.
          </p>
        </div>

        {/* Category Toggle */}
        <CategoryToggle
          options={CATEGORIES.map((c) => ({ id: c.id, label: c.title }))}
          value={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Feature Grid for Active Category */}
        <div className="grid grid-cols-1 gap-3">
          {currentCategoryFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              label={feature.label}
              cost={feature.cost}
              isSelected={selectedFeatures.includes(feature.id)}
              onToggle={() => toggleFeature(feature.id)}
            />
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
