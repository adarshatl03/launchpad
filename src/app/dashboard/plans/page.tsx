import { createClient } from "@/lib/supabase/server";
import { PlansClient } from "@/components/dashboard/PlansClient";

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch all plans for the user
  const { data: plans } = await supabase
    .from("product_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <PlansClient plans={plans} />;
}
