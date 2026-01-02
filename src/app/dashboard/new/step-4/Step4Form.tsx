"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  ArrowLeft,
  Layers,
  Server,
  Code2,
  Database,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updatePlanStep } from "@/lib/actions/planActions";
import { PlanInputs } from "@/types/plan";
import { recommendTechStack } from "@/lib/logic/rulesEngine";
import * as LucideIcons from "lucide-react";

// Helper to resolve icon by name
const IconResolver = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] || LucideIcons.Code2;
  return <Icon className={className} />;
};

const PROJECT_TYPES = [
  { id: "saas", label: "SaaS / Web App", icon: Layers },
  { id: "mobile", label: "Mobile App", icon: Server },
  { id: "ecommerce", label: "E-Commerce", icon: Database },
];

const TEAM_SIZES = [
  { id: "solo", label: "Solo Founder" },
  { id: "small", label: "Small Team (2-5)" },
  { id: "scale", label: "Scale-up (5+)" },
];

interface Step4FormProps {
  planId?: string;
  initialData?: PlanInputs;
}

export default function Step4Form({ planId, initialData }: Step4FormProps) {
  const [projectType, setProjectType] = useState<string>(
    initialData?.projectType || "saas",
  );
  const [teamSize, setTeamSize] = useState<string>(
    initialData?.teamSize || "solo",
  );

  const recommendation = recommendTechStack(projectType, teamSize);

  // Server Action
  const handleSave = async (_state: unknown, _formData: FormData) => {
    if (!planId) return { error: "Plan ID missing" };
    return updatePlanStep(planId, 5, {
      projectType: projectType as PlanInputs["projectType"],
      teamSize: teamSize as PlanInputs["teamSize"],
      selectedStack: recommendation.title,
    });
  };

  const [state, action, isPending] = useActionState(handleSave, null);

  const backHref = planId
    ? `/dashboard/new/step-3?planId=${planId}`
    : "/dashboard/new/step-3";

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {state?.error && (
        <div className="col-span-full text-red-500 text-sm">{state.error}</div>
      )}

      {/* Form / Inputs */}
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">
            Tech Stack Recommendation
          </h2>
          <p className="text-sm text-neutral-400">
            Tell us about your team and goals, and we&apos;ll suggest the best
            tools.
          </p>
        </div>

        {/* Project Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Project Type</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PROJECT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => setProjectType(type.id)}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 text-center transition-all hover:border-neutral-500",
                    projectType === type.id
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400",
                  )}
                >
                  <Icon className="mx-auto mb-2 h-6 w-6" />
                  <span className="text-sm">{type.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Size */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Team Size</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TEAM_SIZES.map((size) => (
              <div
                key={size.id}
                onClick={() => setTeamSize(size.id)}
                className={cn(
                  "cursor-pointer rounded-lg border p-4 text-center transition-all hover:border-neutral-500",
                  teamSize === size.id
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400",
                )}
              >
                <span className="text-sm">{size.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Recommended: {recommendation.title}
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          {recommendation.description}
        </p>

        <div className="space-y-4">
          {recommendation.stack.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-4 rounded-lg bg-neutral-900 p-3 border border-neutral-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-neutral-800">
                <IconResolver
                  name={item.iconName}
                  className="h-5 w-5 text-neutral-300"
                />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">
                  {item.category}
                </p>
                <p className="text-sm font-bold text-white">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 flex justify-between pt-4 border-t border-neutral-800">
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
              Next: Review & Export
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
