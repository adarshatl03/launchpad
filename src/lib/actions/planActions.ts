"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PlanInputs } from "@/types/plan";

const createPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export async function createPlan(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // --- GATING LOGIC ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  const isPro =
    profile?.subscription_status === "pro" ||
    profile?.subscription_status === "team";

  if (!isPro) {
    const { count, error: countError } = await supabase
      .from("product_plans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "archived"); // Count non-archived plans

    if (countError) {
      return { error: "Failed to verify plan limits" };
    }

    if (count !== null && count >= 1) {
      return {
        error: "Free Plan Limit Reached (Max 1). Please Upgrade to Pro.",
      };
    }
  }
  // --------------------

  // Extract inputs
  const problemStatement = formData.get("problem") as string;
  const targetUser = formData.get("user") as string;
  const valueProposition = formData.get("value") as string;
  const nonGoals = formData.get("nonGoals") as string;

  // Generate title from problem statement (first 50 chars)
  const title =
    (formData.get("title") as string) || problemStatement?.slice(0, 50) + "...";

  const initialInputs: Partial<PlanInputs> = {
    problemStatement,
    targetUser,
    valueProposition,
    nonGoals,
  };

  // Insert
  const { data, error } = await supabase
    .from("product_plans")
    .insert({
      user_id: user.id,
      title: title,
      current_step: 2, // Move to Step 2 directly
      inputs: initialInputs,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Create Plan Error:", error);
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return {
      error: `Failed to create plan: ${error.message || "Unknown error"}`,
    };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/new/step-2?planId=${data.id}`);
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
  redirect(`/dashboard/new/step-${step}?planId=${planId}`);
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
