import { getPlan } from "@/lib/actions/planActions";
import Step5Form from "./Step5Form";
import { PlanInputs } from "@/types/plan";

export default async function Step5Page(props: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const params = await props.searchParams;
  const planId = params.planId;

  let initialData: PlanInputs | undefined = undefined;
  let shareToken: string | undefined = undefined;

  if (planId) {
    const plan = await getPlan(planId);
    if (plan) {
      if (plan.inputs) {
        initialData = plan.inputs as PlanInputs;
      }
      shareToken = plan.share_token;
    }
  }

  return (
    <Step5Form
      planId={planId}
      initialData={initialData}
      shareToken={shareToken}
    />
  );
}
