"use client";

import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface ComplexityMeterProps {
  score: number; // 0 to 100
}

export function ComplexityMeter({ score }: ComplexityMeterProps) {
  // Determine color based on score
  let colorClass = "bg-green-500";
  let label = "Low Complexity";

  if (score > 30 && score <= 60) {
    colorClass = "bg-yellow-500";
    label = "Moderate Complexity";
  } else if (score > 60) {
    colorClass = "bg-red-500";
    label = "High Complexity";
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          Build Complexity
          <Info className="h-4 w-4 text-neutral-500" />
        </h3>
        <span
          className={cn(
            "text-sm font-medium px-2 py-0.5 rounded",
            colorClass,
            "bg-opacity-20 text-white",
          )}
        >
          {label}
        </span>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            colorClass,
          )}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        Estimated based on selected features. Higher complexity means longer
        build times and higher cost.
      </p>
    </div>
  );
}
