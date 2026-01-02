"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/Button";
import { Sparkles, LogOut } from "lucide-react";
import { signout } from "@/lib/authActions";

export function DashboardHeader({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-800 bg-neutral-900/80 px-6 backdrop-blur-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 font-bold md:hidden"
      >
        <Sparkles className="h-5 w-5" />
        <span>LaunchPad</span>
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-neutral-400 hidden md:block">
          {user.email}
        </span>
        <form action={signout}>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-400 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  );
}
