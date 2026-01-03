import { getPlan, getPlanVersions } from "@/lib/actions/planActions";
import { getComments } from "@/lib/actions/commentActions";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PlanDetailClient from "@/app/dashboard/plans/[planId]/PlanDetailClient";

export const dynamic = "force-dynamic";

interface PlanDetailPageProps {
  params: Promise<{ planId: string }>;
}

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { planId } = await params;
  const plan = await getPlan(planId);

  if (!plan) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const versions = await getPlanVersions(planId);
  const comments = await getComments(planId);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <PlanDetailClient
        plan={plan}
        initialVersions={versions}
        initialComments={comments}
        currentUserId={user?.id || null}
      />
    </div>
  );
}
