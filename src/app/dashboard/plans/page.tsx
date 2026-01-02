import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Plans</h2>
          <p className="text-neutral-400">
            Manage all your product planning projects
          </p>
        </div>
        <Button asChild className="bg-white text-black hover:bg-neutral-200">
          <Link href="/dashboard/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Plan
          </Link>
        </Button>
      </div>

      {plans && plans.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/dashboard/new/step-${plan.current_step}?planId=${plan.id}`}
              className="group block rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900"
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-white group-hover:text-neutral-100">
                  {plan.title}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      plan.status === "completed"
                        ? "bg-green-900/50 text-green-300"
                        : plan.status === "draft"
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {plan.status}
                  </span>
                  <span className="text-neutral-500">
                    Step {plan.current_step}/5
                  </span>
                </div>
                <p className="text-sm text-neutral-500">
                  {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-center">
          <h3 className="text-lg font-semibold">No plans yet</h3>
          <p className="mb-4 mt-2 max-w-sm text-sm text-neutral-400">
            Create your first product plan to get started
          </p>
          <Button
            asChild
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            <Link href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Plan
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
