"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Step {
  label: string;
  href: string;
}

interface StepProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export function StepProgressBar({ steps, currentStep }: StepProgressBarProps) {
  return (
    <div className="relative flex w-full justify-between">
      {/* Connecting Lines */}
      <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-neutral-800">
        <div
          className="h-full bg-amber-500 transition-all duration-300 ease-in-out"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = isCompleted || isCurrent;

        return (
          <Link
            key={step.label}
            href={isClickable ? step.href : "#"}
            className={cn(
              "flex flex-col items-center gap-2",
              !isClickable && "cursor-default pointer-events-none",
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                isCompleted
                  ? "border-amber-500 bg-amber-500 text-black"
                  : isCurrent
                    ? "border-amber-500 bg-black text-amber-500"
                    : "border-neutral-700 bg-neutral-900 text-neutral-500",
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                isCompleted || isCurrent ? "text-white" : "text-neutral-500",
              )}
            >
              {step.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
