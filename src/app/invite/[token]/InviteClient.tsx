"use client";

import { useEffect, useState } from "react";
import { acceptInvite } from "@/lib/actions/teamActions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";
import { Users, Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function InviteClient({ token }: { token: string }) {
  const [status, setStatus] = useState<
    "loading" | "idle" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orgName, setOrgName] = useState("");
  const router = useRouter();

  const handleAccept = async () => {
    setStatus("loading");
    const res = await acceptInvite(token);

    if (res.error) {
      if (res.error === "unauthorized") {
        toast.info("Please log in to accept the invitation");
        router.push(`/signup?invite=${token}`);
        return;
      }
      setStatus("error");
      setErrorMsg(res.error);
      toast.error(res.error);
    } else {
      setStatus("success");
      setOrgName(res.orgName || "the team");
      toast.success("Welcome to the team!");
      setTimeout(() => {
        router.push("/dashboard/teams");
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
        {/* Abstract Background Accents */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />

        <FadeIn direction="down">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-900">
                <Users className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="text-center">
          <FadeIn delay={0.1}>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              Team Invitation
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mb-8 text-zinc-400">
              You've been invited to collaborate on product plans and roadmap
              strategy.
            </p>
          </FadeIn>

          {status === "idle" && (
            <ScaleIn delay={0.3}>
              <div className="space-y-4">
                <Button
                  onClick={handleAccept}
                  className="group h-14 w-full bg-white text-lg font-semibold text-black hover:bg-zinc-200"
                >
                  Join Team
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-xs text-zinc-500">
                  By joining, you'll gain access to shared plans and resources.
                </p>
              </div>
            </ScaleIn>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="mt-4 text-sm text-zinc-400">
                Verifying invitation...
              </p>
            </div>
          )}

          {status === "success" && (
            <FadeIn direction="up">
              <div className="space-y-4 rounded-2xl bg-green-500/10 p-6 text-green-400">
                <Sparkles className="mx-auto h-8 w-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-bold">Successfully Joined!</h3>
                  <p className="text-sm opacity-80">
                    Welcome to {orgName}. Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </FadeIn>
          )}

          {status === "error" && (
            <FadeIn direction="up">
              <div className="space-y-4 rounded-2xl bg-red-500/10 p-6 text-red-500">
                <h3 className="text-lg font-bold">Invitation Error</h3>
                <p className="text-sm opacity-80">{errorMsg}</p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="mt-2 w-full border-red-500/20 text-red-500 hover:bg-red-500/10"
                >
                  Return Home
                </Button>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
