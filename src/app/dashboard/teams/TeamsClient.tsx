"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Users, Shield, ArrowRight } from "lucide-react";
import { createOrganization } from "@/lib/actions/teamActions";
import { toast } from "sonner";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  userRole: string;
}

interface TeamsClientProps {
  initialOrganizations: Organization[];
  userId: string;
}

export default function TeamsClient({
  initialOrganizations,
  userId,
}: TeamsClientProps) {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const res = await createOrganization(newName);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Organization created successfully");
      setNewName("");
      setIsCreating(false);
      // In a real app, revalidatePath or router.refresh() would handle this.
      // For now, we manually update for a snappier feel if revalidation isn't enough.
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {organizations.length === 0 && !isCreating ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">
            Create your first team
          </h3>
          <p className="mb-8 max-w-sm text-zinc-400">
            Organizations allow you to collaborate with teammates, share product
            plans, and manage billing for groups.
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-white text-black hover:bg-zinc-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Link
              key={org.id}
              href={`/dashboard/teams/${org.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300 capitalize">
                    {org.userRole}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 decoration-blue-400/30 transition-colors">
                  {org.name}
                </h3>
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-zinc-500 group-hover:text-zinc-300">
                Manage Team <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          ))}

          {isCreating ? (
            <div className="rounded-xl border border-blue-500/50 bg-blue-500/5 p-6 ring-1 ring-blue-500/50">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Organization Name
                  </label>
                  <Input
                    autoFocus
                    placeholder="e.g. Acme Corp"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-zinc-800 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-transparent p-6 text-zinc-500 transition-all hover:border-zinc-600 hover:bg-zinc-900/50 hover:text-zinc-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Organization
            </button>
          )}
        </div>
      )}
    </div>
  );
}
