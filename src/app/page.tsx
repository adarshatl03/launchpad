import { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "AtoZyx LaunchPad | Build Execution-Ready SaaS Plans",
  description:
    "The deterministic flow to turn your vague ideas into execution-ready plans. Define scope, complexity, and roadmaps with AI.",
};

export default function Home() {
  return <HomeClient />;
}
