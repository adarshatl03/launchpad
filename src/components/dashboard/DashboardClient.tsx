"use client";

import { Button } from "@/components/ui/Button";
import { PlusCircle, Info } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";
import { User } from "@supabase/supabase-js";

interface DashboardClientProps {
  user: User | null;
}

export function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <FadeIn direction="none">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h2>
            <p className="text-neutral-400">
              Welcome back, {user?.user_metadata?.full_name || "Creator"}.
            </p>
          </div>
        </FadeIn>
        <FadeIn direction="none" delay={0.1}>
          <Button asChild className="bg-white text-black hover:bg-neutral-200">
            <a href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Plan
            </a>
          </Button>
        </FadeIn>
      </div>

      {/* Empty State / Placeholder */}
      <ScaleIn
        delay={0.2}
        className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-center transition-all hover:border-neutral-700"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
          <Info className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">
          No Product Plans yet
        </h3>
        <p className="mb-4 mt-2 max-w-sm text-sm text-neutral-400">
          You haven&apos;t created any product plans. Start by creating a new
          plan to define your MVP.
        </p>
        <Button
          asChild
          variant="outline"
          className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <a href="/dashboard/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Plan
          </a>
        </Button>
      </ScaleIn>
    </div>
  );
}
