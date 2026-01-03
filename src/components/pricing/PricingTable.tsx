"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import Link from "next/link";
import { SUBSCRIPTION_PLANS } from "@/lib/config/subscriptions";
import { ScaleIn } from "@/components/ui/Motion";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface PricingTableProps {
  user: User | null;
}

export function PricingTable({ user }: PricingTableProps) {
  const [interval, setInterval] = useState<"month" | "year">("month");

  return (
    <div className="space-y-12">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="relative flex rounded-full bg-neutral-900 p-1 ring-1 ring-neutral-800">
          <button
            onClick={() => setInterval("month")}
            className={cn(
              "relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-colors",
              interval === "month"
                ? "text-white"
                : "text-neutral-400 hover:text-neutral-200",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("year")}
            className={cn(
              "relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-colors",
              interval === "year"
                ? "text-white"
                : "text-neutral-400 hover:text-neutral-200",
            )}
          >
            Yearly{" "}
            <span className="text-xs text-amber-500 font-bold ml-1">-20%</span>
          </button>
          <div
            className={cn(
              "absolute inset-y-1 rounded-full bg-neutral-800 transition-all duration-300",
              interval === "month"
                ? "left-1 w-[calc(50%-4px)]"
                : "left-[50%] w-[calc(50%-4px)]",
            )}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-8 max-w-4xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan, index) => {
          const isFree = plan.id === "free";
          const isPro = plan.id === "pro";

          // Simple visual calculation for yearly price (just * 12 * 0.8 for display, or generic logic)
          // Since config might be static, we'll just mock the display logic here or use the plan data if it supports it.
          // For now, assuming plan.price is monthly.
          const displayPrice =
            interval === "year" && !isFree
              ? ((plan.price * 12 * 0.8) / 1200).toFixed(0) // Show monthly cost when billed yearly
              : isFree
                ? plan.price
                : (plan.price / 100).toFixed(0);

          return (
            <ScaleIn
              key={plan.id}
              delay={0.2 + index * 0.1}
              className={cn(
                "relative rounded-2xl border bg-neutral-900 p-8 transition-transform hover:scale-[1.02]",
                isPro
                  ? "border-white shadow-2xl shadow-white/10"
                  : "border-neutral-800",
              )}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-white px-4 py-1 text-sm font-semibold text-black">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-neutral-400">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${displayPrice}
                  </span>
                  <span className="text-neutral-400">/mo</span>
                </div>
                {interval === "year" && !isFree && (
                  <p className="mt-1 text-xs text-amber-500 font-medium">
                    Billed ${((plan.price * 12 * 0.8) / 100).toFixed(0)} yearly
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {isFree ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  <Link href={user ? "/dashboard" : "/signup"}>
                    {user ? "Current Plan" : "Get Started"}
                  </Link>
                </Button>
              ) : (
                <form action="/api/checkout" method="POST">
                  <input
                    type="hidden"
                    name="priceId"
                    value={plan.stripePriceId} // This would need to swap if we had yearly price IDs
                  />
                  <input type="hidden" name="interval" value={interval} />
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-neutral-200"
                  >
                    {user ? "Upgrade Now" : "Start 14-Day Free Trial"}
                  </Button>
                </form>
              )}
            </ScaleIn>
          );
        })}
      </div>
    </div>
  );
}
