import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import OrgDetailClient from "@/app/dashboard/teams/[orgId]/OrgDetailClient";

export default async function OrgDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();

  if (orgError || !org) {
    notFound();
  }

  // Fetch user role in org
  const { data: member, error: memberError } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (memberError || !member) {
    // Check if user is the owner (in case members table update was skipped)
    if (org.owner_id !== user.id) {
      redirect("/dashboard/teams");
    }
  }

  const role = member?.role || "owner";

  // Fetch members
  const { data: members } = await supabase
    .from("organization_members")
    .select("*, profiles(full_name, email, avatar_url)")
    .eq("organization_id", orgId);

  // Fetch pending invites
  const { data: invites } = await supabase
    .from("invitations")
    .select("*")
    .eq("organization_id", orgId);

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-8">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {org.name}
          </h1>
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 capitalize">
            {role}
          </span>
        </div>
        <p className="text-zinc-400">Manage your team members and invites.</p>
      </div>

      <OrgDetailClient
        org={org}
        members={(members as any) || []}
        invites={(invites as any) || []}
        userRole={role}
      />
    </div>
  );
}
