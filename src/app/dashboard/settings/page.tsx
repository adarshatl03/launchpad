import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-neutral-400">Manage your account preferences</p>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-400">
              Email
            </label>
            <p className="text-white">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-400">
              User ID
            </label>
            <p className="text-white font-mono text-sm">{user.id}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
        <p className="text-neutral-400 text-sm">More settings coming soon...</p>
      </div>
    </div>
  );
}
