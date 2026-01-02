import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-900 text-neutral-50">
      {/* Sidebar - Hidden on mobile initially, customizable */}
      <DashboardSidebar user={user} />

      <div className="flex flex-1 flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
