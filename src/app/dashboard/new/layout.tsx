import { WizardLayout } from "@/components/wizard/WizardLayout";

export default function NewPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Create New Product Plan
        </h1>
        <p className="text-neutral-400">
          Define your idea, scope your MVP, and generate an execution roadmap.
        </p>
      </div>

      <WizardLayout>{children}</WizardLayout>
    </div>
  );
}
