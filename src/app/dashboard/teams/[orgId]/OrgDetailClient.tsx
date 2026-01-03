"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Plus,
  Users,
  Mail,
  Clock,
  Trash2,
  UserPlus,
  ArrowLeft,
  Search,
} from "lucide-react";
import { inviteMember } from "@/lib/actions/teamActions";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Profile {
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface Member {
  id: string;
  role: string;
  profiles: Profile;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface OrgDetailClientProps {
  org: any;
  members: Member[];
  invites: Invitation[];
  userRole: string;
}

export default function OrgDetailClient({
  org,
  members,
  invites,
  userRole,
}: OrgDetailClientProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">(
    "viewer",
  );
  const [search, setSearch] = useState("");

  const canInvite = ["owner", "admin"].includes(userRole);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const res = await inviteMember(org.id, inviteEmail, inviteRole);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
      setIsInviting(false);
      window.location.reload();
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.profiles.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.profiles.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-10">
      <Link
        href="/dashboard/teams"
        className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Members List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Team Members</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search players..."
                className="pl-10 bg-zinc-900 border-zinc-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/50 text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="group hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                          {member.profiles.avatar_url ? (
                            <img
                              src={member.profiles.avatar_url}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <Users className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {member.profiles.full_name || "New User"}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {member.profiles.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                          member.role === "owner"
                            ? "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                            : member.role === "admin"
                              ? "bg-purple-500/10 text-purple-500 ring-purple-500/20"
                              : "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
                        )}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {canInvite && member.role !== "owner" && (
                        <button className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Invites & Actions */}
        <div className="space-y-6">
          {canInvite && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold">
                <UserPlus className="h-5 w-5 text-blue-500" />
                Invite Teammate
              </div>
              <p className="text-sm text-zinc-400">
                Add members to collaborate on plans.
              </p>

              <form onSubmit={handleInvite} className="space-y-4">
                <Input
                  placeholder="Email address"
                  type="email"
                  className="bg-zinc-900 border-zinc-800"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <select
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                >
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="editor">Editor (Can edit plans)</option>
                  <option value="admin">Admin (Can manage members)</option>
                </select>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Send Invitation
                </Button>
              </form>
            </div>
          )}

          {invites.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                Pending Invites
              </h3>
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex flex-col gap-1 pb-3 border-b border-zinc-800 last:border-0 last:pb-0"
                  >
                    <p className="text-sm text-white truncate">
                      {invite.email}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 capitalize">
                        {invite.role}
                      </span>
                      <button className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
