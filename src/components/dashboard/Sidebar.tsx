"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  Settings,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Plans", href: "/dashboard/plans", icon: Map },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-neutral-800 bg-neutral-900 md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-6 font-bold tracking-tighter text-white">
        <Sparkles className="h-5 w-5" />
        <span>AtoZyx LaunchPad</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <Button className="w-full bg-white text-black hover:bg-neutral-200 gap-2 font-semibold">
            <PlusCircle className="h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      <div className="border-t border-neutral-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-neutral-950 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 font-bold text-neutral-400">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-medium text-neutral-500">
              Logged in as
            </span>
            <span className="truncate text-sm font-semibold text-white">
              {user.user_metadata.full_name || "User"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
