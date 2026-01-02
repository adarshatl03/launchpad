import { getPlan } from "@/lib/actions/planActions";
import Step2Form from "./Step2Form";
import { PlanInputs } from "@/types/plan";

export default async function Step2Page(props: {
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

  return <Step2Form planId={planId} initialData={initialData} />;
}
