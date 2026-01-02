"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Check, CreditCard, Zap } from "lucide-react";
import {
  createCheckoutSession,
  createPortalSession,
} from "@/lib/actions/stripeActions";
import { SUBSCRIPTION_PLANS } from "@/lib/config/subscriptions";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BillingClientProps {
  subscriptionStatus: "free" | "pro" | "team";
}

export default function BillingClient({
  subscriptionStatus,
}: BillingClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle URL toasts (MVP style)
  useEffect(() => {
    if (searchParams.get("checkout_success")) {
      alert("✅ Subscription successful! Welcome to Pro.");
      router.replace("/dashboard/billing");
    }
    if (searchParams.get("checkout_canceled")) {
      alert("❌ Subscription canceled.");
      router.replace("/dashboard/billing");
    }
  }, [searchParams, router]);

  // Actions
  const handleUpgrade = async (priceId: string) => {
    await createCheckoutSession(priceId);
  };

  const handlePortal = async () => {
    await createPortalSession();
  };

  // We use separate states for different buttons if needed, but for now simple wrappers
  // Actually, useActionState might be tricky with arguments.
  // We can just use standard async handlers for buttons since these are redirects.
  // But to show loading state, we might want manual state.

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Billing & Plans</h2>
          <p className="text-neutral-400">
            Manage your subscription and billing details.
          </p>
        </div>
        {subscriptionStatus !== "free" && (
          <form action={handlePortal}>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:text-white"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentPlan =
            (plan.id === "free" && subscriptionStatus === "free") ||
            (plan.id === "pro" && subscriptionStatus === "pro");

          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-xl border p-8 flex flex-col",
                isCurrentPlan
                  ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                  : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700",
              )}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-white">
                  {plan.price === 0 ? "Free" : `$${plan.price / 100}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-neutral-500">/month</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm text-neutral-300"
                  >
                    <Check className="mr-3 h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <Button
                  disabled
                  className="w-full bg-neutral-800 text-neutral-400 border border-neutral-700"
                >
                  Current Plan
                </Button>
              ) : (
                <form action={() => handleUpgrade(plan.stripePriceId)}>
                  <Button
                    type="submit"
                    className={cn(
                      "w-full",
                      plan.id === "pro"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white text-black",
                    )}
                    disabled={plan.id === "free"} // Can't downgrade to free via this button in MVP
                  >
                    {plan.id === "pro" && <Zap className="mr-2 h-4 w-4" />}
                    Upgrade to {plan.name}
                  </Button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
