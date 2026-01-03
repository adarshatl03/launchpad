"use client";

import { cn } from "@/lib/utils";
import { Check, Zap } from "lucide-react";

interface FeatureCardProps {
  label: string;
  cost: number;
  isSelected: boolean;
  onToggle: () => void;
}

export function FeatureCard({
  label,
  cost,
  isSelected,
  onToggle,
}: FeatureCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group relative flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all hover:border-neutral-600",
        isSelected
          ? "border-green-500 bg-green-500/10"
          : "border-neutral-800 bg-neutral-900/50",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
            isSelected
              ? "border-green-500 bg-green-500 text-black"
              : "border-neutral-600 bg-transparent group-hover:border-neutral-500",
          )}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </div>
        <span
          className={cn(
            "font-medium transition-colors",
            isSelected
              ? "text-white"
              : "text-neutral-400 group-hover:text-neutral-200",
          )}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-1.5 rounded-full bg-neutral-950 px-2 py-1 text-xs font-medium text-amber-500/80">
        <Zap className="h-3 w-3" />
        <span>+{cost}</span>
      </div>
    </button>
  );
}
