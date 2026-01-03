import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Subscription Status
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  const status =
    (profile?.subscription_status as "free" | "pro" | "team") || "free";

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <BillingClient subscriptionStatus={status} />
    </div>
  );
}
