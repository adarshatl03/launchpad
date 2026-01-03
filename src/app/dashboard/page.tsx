import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

import { checkPlanLimits } from "@/lib/actions/limitActions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const limits = await checkPlanLimits();

  return <DashboardClient user={user} limits={limits} />;
}
