import { getPlan } from "@/lib/actions/planActions";
import Step4Form from "./Step4Form";
import { PlanInputs } from "@/types/plan";

export default async function Step4Page(props: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const params = await props.searchParams;
  const planId = params.planId;

  let initialData: PlanInputs | undefined = undefined;

  if (planId) {
    const plan = await getPlan(planId);
    if (plan && plan.inputs) {
      initialData = plan.inputs as PlanInputs;
    }
  }

  return <Step4Form planId={planId} initialData={initialData} />;
}
