"use server";

import { createClient } from "@/lib/supabase/server";

export type PlanLimitResult = {
  allowed: boolean;
  reason?: "limit_reached" | "unauthorized";
  currentCount?: number;
  maxAllowed?: number;
  tier?: string;
};

export async function checkPlanLimits(): Promise<PlanLimitResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, reason: "unauthorized" };
  }

  // 1. Get User Subscription Status
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  const tier = profile?.subscription_status || "free";

  // 2. Define Limits
  const MAX_FREE_PLANS = 1;

  if (tier === "pro" || tier === "team") {
    return { allowed: true, tier };
  }

  // 3. Count Existing Plans
  const { count, error } = await supabase
    .from("product_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error counting plans", error);
    // Fail safe: allow? or block? Block is safer for limits.
    return { allowed: false, reason: "limit_reached" };
  }

  const currentCount = count || 0;

  if (currentCount >= MAX_FREE_PLANS) {
    return {
      allowed: false,
      reason: "limit_reached",
      currentCount,
      maxAllowed: MAX_FREE_PLANS,
      tier,
    };
  }

  return { allowed: true, tier, currentCount, maxAllowed: MAX_FREE_PLANS };
}
