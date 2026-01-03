"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PlanInputs } from "@/types/plan";

const createPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

import { checkPlanLimits } from "./limitActions";

export async function createPlan(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check limits
  const limitCheck = await checkPlanLimits();
  if (!limitCheck.allowed) {
    return {
      error:
        limitCheck.reason === "limit_reached"
          ? "Plan limit reached. Upgrade to Pro for unlimited plans."
          : "Failed to check plan limits",
    };
  }

  const title = formData.get("title") as string;

  // Validate
  const result = createPlanSchema.safeParse({ title });
  if (!result.success) {
    if ("flatten" in result.error) {
      const flat = result.error.flatten();
      const firstError = flat.fieldErrors.title?.[0] || "Invalid input";
      return { error: firstError };
    }
    return { error: "Validation failed" };
  }

  // Insert
  const { data, error } = await supabase
    .from("product_plans")
    .insert({
      user_id: user.id,
      title: title,
      current_step: 1,
      inputs: {},
    })
    .select("id")
    .single();

  if (error) {
    console.error("Create Plan Error:", error);
    return { error: "Failed to create plan" };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/new/step-1?planId=${data.id}`);
}

export async function updatePlanStep(
  planId: string,
  step: number,
  inputs: Partial<PlanInputs>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Get current inputs first to merge (if jsonb update behavior is overwrite-only via simple update)
  // Supabase/Postgres jsonb update can be partial, but simple update({ inputs: ... }) overwrites the column.
  // We need to fetch, merge, and update, OR use a jsonb_set query (less easy with simple JS client).
  // For MVP, fetch-merge-update is fine for low concurrency.

  // 1. Fetch current plan
  const { data: currentPlan, error: fetchError } = await supabase
    .from("product_plans")
    .select("inputs")
    .eq("id", planId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !currentPlan) {
    return { error: "Plan not found" };
  }

  const mergedInputs = { ...currentPlan.inputs, ...inputs };

  // 2. Update
  const { error } = await supabase
    .from("product_plans")
    .update({
      inputs: mergedInputs,
      current_step: step, // Update progress
      updated_at: new Date().toISOString(),
    })
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update Plan Error:", error);
    return { error: "Failed to update plan" };
  }

  revalidatePath(`/dashboard/new/step-${step}`);
  return { success: true };
}

export async function getPlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("product_plans")
    .select("*")
    .eq("id", planId)
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data;
}

export async function finishPlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("product_plans")
    .update({
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Finish Plan Error:", error);
    return { error: "Failed to finish plan" };
  }

  revalidatePath("/dashboard");
  // Redirect to dashboard or detail view
  redirect("/dashboard");
}

export async function createShareToken(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const shareToken = crypto.randomUUID();

  const { error } = await supabase
    .from("product_plans")
    .update({
      share_token: shareToken,
      updated_at: new Date().toISOString(),
    })
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Create Share Token Error:", error);
    return { error: "Failed to generate share link" };
  }

  return { success: true, token: shareToken };
}

export async function getPlanByToken(token: string) {
  const supabase = await createClient();

  // We use a separate query or bypass auth check because this is public
  // RLS mapping: "Public can view plans with valid share token"
  const { data, error } = await supabase
    .from("product_plans")
    .select("*, profiles(full_name)")
    .eq("share_token", token)
    .single();

  if (error) {
    console.error("Get Plan By Token Error:", error);
    return null;
  }
  return data;
}
