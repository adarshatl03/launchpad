"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(
  planId: string,
  content: string,
  parentId?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("plan_comments")
    .insert({
      plan_id: planId,
      user_id: user.id,
      content,
      parent_id: parentId,
    })
    .select("*, profiles(full_name, avatar_url)")
    .single();

  if (error) {
    console.error("Add Comment Error:", error);
    return { error: "Failed to post comment" };
  }

  revalidatePath(`/dashboard/plans/${planId}`);
  return { success: true, comment: data };
}

export async function getComments(planId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plan_comments")
    .select("*, profiles(full_name, avatar_url)")
    .eq("plan_id", planId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Get Comments Error:", error);
    return [];
  }

  return data;
}

export async function deleteComment(commentId: string, planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("plan_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Delete Comment Error:", error);
    return { error: "Failed to delete comment" };
  }

  revalidatePath(`/dashboard/plans/${planId}`);
  return { success: true };
}
