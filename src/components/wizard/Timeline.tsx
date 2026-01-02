"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Milestone {
  id: string;
  title: string;
  duration: string;
  description: string;
  status: "completed" | "current" | "pending";
}

interface TimelineProps {
  milestones: Milestone[];
}

export function Timeline({ milestones }: TimelineProps) {
  return (
    <div className="space-y-8">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="relative flex gap-4">
          {/* Connector Line */}
          {index !== milestones.length - 1 && (
            <div className="absolute left-[15px] top-8 h-full w-[2px] bg-neutral-800" />
          )}

          {/* Icon */}
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 ring-2 ring-neutral-800">
            {milestone.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : milestone.status === "current" ? (
              <Clock className="h-5 w-5 text-yellow-500" />
            ) : (
              <Circle className="h-5 w-5 text-neutral-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-1">
            <div className="flex items-center justify-between">
              <h4
                className={cn(
                  "text-base font-semibold",
                  milestone.status === "pending"
                    ? "text-neutral-400"
                    : "text-white",
                )}
              >
                {milestone.title}
              </h4>
              <span className="text-sm font-medium text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                {milestone.duration}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-400">
              {milestone.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
