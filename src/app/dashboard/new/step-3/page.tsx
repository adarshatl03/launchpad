import { getPlan } from "@/lib/actions/planActions";
import Step3Form from "./Step3Form";
import { PlanInputs } from "@/types/plan";
import { generateRoadmap } from "@/lib/logic/rulesEngine";

export default async function Step3Page(props: {
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

  // Generate Roadmap
  const complexityScore = initialData?.complexityScore || 10;
  const roadmap = generateRoadmap(complexityScore);

  return (
    <Step3Form
      planId={planId}
      initialData={initialData}
      generatedRoadmap={roadmap}
    />
  );
}
