"use client";

import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import Link from "next/link";
import { SUBSCRIPTION_PLANS } from "@/lib/config/subscriptions";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";
import { User } from "@supabase/supabase-js";

interface PricingClientProps {
  user: User | null;
}

export function PricingClient({ user }: PricingClientProps) {
  return (
    <div className="min-h-screen bg-neutral-950 py-24 px-4 text-neutral-50 selection:bg-neutral-800">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 text-lg text-neutral-400">
              Choose the plan that&apos;s right for you
            </p>
          </FadeIn>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-8 max-w-4xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const isFree = plan.id === "free";
            const isPro = plan.id === "pro";

            return (
              <ScaleIn
                key={plan.id}
                delay={0.2 + index * 0.1}
                className={`relative rounded-2xl border ${
                  isPro
                    ? "border-white shadow-2xl shadow-white/20"
                    : "border-neutral-800"
                } bg-neutral-900 p-8 transition-transform hover:scale-[1.02]`}
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
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-white">
                      ${isFree ? plan.price : (plan.price / 100).toFixed(0)}
                    </span>
                    <span className="text-neutral-400">/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-neutral-300">
                        {feature}
                      </span>
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
                      value={plan.stripePriceId}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-neutral-200"
                    >
                      {user ? "Upgrade Now" : "Get Started"}
                    </Button>
                  </form>
                )}
              </ScaleIn>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <FadeIn delay={0.5}>
          <div className="mt-16 text-center">
            <p className="text-sm text-neutral-500">
              All plans include 14-day money-back guarantee. No credit card
              required for Free plan.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
