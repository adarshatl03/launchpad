import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeamsClient from "./TeamsClient";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch organizations where the user is a member
  const { data: members, error } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(*)")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching organizations:", error);
  }

  const organizations =
    members?.map((m) => ({
      ...m.organizations,
      userRole: m.role,
    })) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Teams
          </h1>
          <p className="mt-2 text-zinc-400">
            Collaborate with your team members on product plans.
          </p>
        </div>
      </div>

      <TeamsClient
        initialOrganizations={organizations as any}
        userId={user.id}
      />
    </div>
  );
}
