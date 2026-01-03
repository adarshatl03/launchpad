"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrganization(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating organization:", error);
    return { error: error.message };
  }

  // Add the owner as a member
  await supabase.from("organization_members").insert({
    organization_id: data.id,
    user_id: user.id,
    role: "owner",
  });

  revalidatePath("/dashboard/teams");
  return { success: true, data };
}

export async function inviteMember(
  orgId: string,
  email: string,
  role: "admin" | "editor" | "viewer",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if user is owner/admin of the org
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (!member || !["owner", "admin"].includes(member.role)) {
    return { error: "Insufficient permissions" };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  const { error } = await supabase.from("invitations").insert({
    organization_id: orgId,
    email,
    role,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Error inviting member:", error);
    return { error: error.message };
  }

  revalidatePath(`/dashboard/teams/${orgId}`);
  return { success: true };
}

export async function getOrganizations() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("*");
  if (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
  return data;
}

export async function getOrganizationMembers(orgId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_members")
    .select("*, profiles(full_name, email)")
    .eq("organization_id", orgId);

  if (error) {
    console.error("Error fetching members:", error);
    return [];
  }
  return data;
}
