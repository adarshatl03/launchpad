import Link from "next/link";
import { Plus, Rocket } from "lucide-react";

export function DashboardEmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
        <Rocket className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">
        No plans created yet
      </h3>
      <p className="mb-6 max-w-sm text-sm text-zinc-400">
        Start your journey by creating a roadmap for your next big idea. It only
        takes a few minutes.
      </p>
      <Link
        href="/new"
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-amber-400"
      >
        <Plus className="h-4 w-4" />
        Create New Plan
      </Link>
    </div>
  );
}
