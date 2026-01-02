"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

// Define the steps for the wizard
const STEPS = [
  { id: 1, name: "Idea Clarifier", href: "/dashboard/new/step-1" },
  { id: 2, name: "Scope Builder", href: "/dashboard/new/step-2" },
  { id: 3, name: "Execution Roadmap", href: "/dashboard/new/step-3" },
  { id: 4, name: "Tech Stack", href: "/dashboard/new/step-4" },
  { id: 5, name: "Review", href: "/dashboard/new/step-5" },
];

export function WizardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Helper to determine step status
  const getStepStatus = (stepHref: string, index: number) => {
    // Current step
    if (pathname.includes(stepHref)) return "current";

    // Past steps (simple logic: if we are on step 3, step 1 and 2 are done)
    // This is a naive implementation; in a real app, check actual completion state.
    const currentStepIndex = STEPS.findIndex((s) => pathname.includes(s.href));
    if (index < currentStepIndex && currentStepIndex !== -1) return "complete";

    return "upcoming";
  };

  // Get planId at top level
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  return (
    <div className="flex flex-col space-y-8">
      {/* Progress Bar / Stepper */}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {STEPS.map((step, stepIdx) => {
            const status = getStepStatus(step.href, stepIdx);

            // Construct URL
            const href = planId ? `${step.href}?planId=${planId}` : step.href;

            const isClickable = status === "complete" || status === "current";

            return (
              <li
                key={step.name}
                className={cn(
                  stepIdx !== STEPS.length - 1
                    ? "pr-4 sm:pr-8 md:pr-16 w-full"
                    : "relative",
                )}
              >
                <Link
                  href={isClickable ? href : "#"}
                  className={cn(
                    "block",
                    !isClickable && "cursor-default pointer-events-none",
                  )}
                >
                  {status === "complete" ? (
                    <div className="group flex w-full flex-col border-l-0 sm:border-t-4 border-green-600 pb-0 sm:pb-0 sm:pt-4 transition-colors">
                      <span className="text-sm font-medium text-green-600">
                        Step {step.id}
                        <Check className="ml-2 inline-block h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : status === "current" ? (
                    <div
                      className="flex w-full flex-col border-l-0 sm:border-t-4 border-white pb-0 sm:pb-0 sm:pt-4"
                      aria-current="step"
                    >
                      <span className="text-sm font-medium text-white">
                        Step {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : (
                    <div className="group flex w-full flex-col border-l-0 sm:border-t-4 border-neutral-700 pb-0 sm:pb-0 sm:pt-4 transition-colors hover:border-neutral-500">
                      <span className="text-sm font-medium text-neutral-500 group-hover:text-neutral-300">
                        Step {step.id}
                      </span>
                      <span className="text-sm font-medium text-neutral-500 group-hover:text-neutral-300">
                        {step.name}
                      </span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
