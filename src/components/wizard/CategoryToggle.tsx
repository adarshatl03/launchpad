"use client";

import { cn } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
}

interface CategoryToggleProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryToggle({
  options,
  value,
  onChange,
}: CategoryToggleProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-1">
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all",
              isSelected
                ? "bg-amber-500 text-black shadow-sm"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
