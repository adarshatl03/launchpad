"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { StepProgressBar } from "./StepProgressBar";

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
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  // Determine current step index
  const currentStepIndex = STEPS.findIndex((s) => pathname.includes(s.href));
  const activeStep = currentStepIndex === -1 ? 0 : currentStepIndex;

  // Prepare steps for Progress Bar with query params preserved
  const progressSteps = STEPS.map((step) => ({
    label: step.name,
    href: planId ? `${step.href}?planId=${planId}` : step.href,
  }));

  return (
    <div className="flex flex-col space-y-8">
      {/* Progress Bar */}
      <nav aria-label="Progress" className="px-4 md:px-0">
        <StepProgressBar steps={progressSteps} currentStep={activeStep} />
      </nav>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
