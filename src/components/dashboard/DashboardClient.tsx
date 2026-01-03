"use client";

import { useProductPlans } from "@/hooks/useProductPlans";
import { PlanCard } from "@/components/dashboard/PlanCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";
import { User } from "@supabase/supabase-js";

import { PlanLimitResult } from "@/lib/actions/limitActions";

interface DashboardClientProps {
  user: User | null;
  limits: PlanLimitResult;
}

export function DashboardClient({ user, limits }: DashboardClientProps) {
  const { plans, isLoading } = useProductPlans();
  const isLimitReached = !limits.allowed;

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
              <span className="ml-2 text-xs text-neutral-500">
                ({limits.currentCount}/
                {limits.tier === "pro" ? "∞" : limits.maxAllowed} Plans)
              </span>
            </p>
          </div>
        </FadeIn>
        <FadeIn direction="none" delay={0.1}>
          {isLimitReached ? (
            <Button
              asChild
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              <a href="/pricing">
                <span className="mr-2">⚡</span> Upgrade to Create
              </a>
            </Button>
          ) : (
            <Button
              asChild
              className="bg-white text-black hover:bg-neutral-200"
            >
              <a href="/dashboard/new/step-1">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Plan
              </a>
            </Button>
          )}
        </FadeIn>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <DashboardSkeleton />
        ) : !plans || plans.length === 0 ? (
          <ScaleIn delay={0.2}>
            <DashboardEmptyState isLimitReached={isLimitReached} />
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
