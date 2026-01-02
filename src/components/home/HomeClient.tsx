"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Layout, Zap, FileText, Sparkles } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";

export function HomeClient() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-50 selection:bg-neutral-800">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <FadeIn
            direction="none"
            className="flex items-center gap-2 font-bold text-xl tracking-tighter"
          >
            <Sparkles className="h-5 w-5 text-neutral-50" />
            <span>AtoZyx LaunchPad</span>
          </FadeIn>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-400 hover:text-neutral-50 transition-colors"
            >
              Log in
            </Link>
            <Button
              asChild
              className="bg-neutral-50 text-neutral-950 hover:bg-neutral-200"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          <div className="max-w-4xl space-y-8">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-400 backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                v0.1.10 Now Live
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                Turn vague ideas into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">
                  execution-ready plans.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400">
                Stop coding without a map. LaunchPad guides you through a
                deterministic flow to define your MVP, estimate complexity, and
                generate a roadmap before you write a single line of code.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} direction="up" distance={10}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base bg-white text-black hover:bg-neutral-200 rounded-full"
                >
                  <Link href="/signup">
                    Start Building <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white rounded-full bg-transparent"
                >
                  <Link href="/login">Existing User</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              delay={0.5}
              icon={<Layout className="h-8 w-8" />}
              title="Scope Definition"
              description="Define exactly what features are in your MVP and what stays in the backlog."
            />
            <FeatureCard
              delay={0.6}
              icon={<Zap className="h-8 w-8" />}
              title="Complexity Scoring"
              description="Get real-time estimates on how difficult your idea is to build based on your choices."
            />
            <FeatureCard
              delay={0.7}
              icon={<FileText className="h-8 w-8" />}
              title="Auto-Generated Docs"
              description="Export professional Product Requirements Documents (PRD) instantly."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-neutral-400 text-sm">
          <p>© 2026 AtoZyx LaunchPad. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms
            </Link>
            <Link href="#" className="hover:text-white">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <ScaleIn
      delay={delay}
      className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 transition-all hover:border-neutral-700 hover:bg-neutral-900 hover:scale-[1.02]"
    >
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-neutral-800 p-3 text-neutral-200 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-neutral-400">{description}</p>
    </ScaleIn>
  );
}
