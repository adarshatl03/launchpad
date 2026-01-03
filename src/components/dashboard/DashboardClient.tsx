"use client";

import { useProductPlans } from "@/hooks/useProductPlans";
import { PlanCard } from "@/components/dashboard/PlanCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";
import { User } from "@supabase/supabase-js";

interface DashboardClientProps {
  user: User | null;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { plans, isLoading } = useProductPlans();

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
            <a href="/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Plan
            </a>
          </Button>
        </FadeIn>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <DashboardSkeleton />
        ) : !plans || plans.length === 0 ? (
          <ScaleIn delay={0.2}>
            <DashboardEmptyState />
          </ScaleIn>
        ) : (
          <FadeIn
            direction="up"
            delay={0.2}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </FadeIn>
        )}
      </div>
    </div>
  );
}
