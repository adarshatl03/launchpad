import { FEATURE_CATEGORIES } from "../config/features";
import { Milestone } from "@/components/wizard/Timeline";

// 1. Complexity Calculation
export function calculateComplexity(selectedFeatureIds: string[]): number {
  const totalScore = FEATURE_CATEGORIES.flatMap((c) => c.features)
    .filter((f) => selectedFeatureIds.includes(f.id))
    .reduce((acc, curr) => acc + curr.cost, 0);

  return Math.min(totalScore, 100);
}

// 2. Roadmap Generation
export function generateRoadmap(complexityScore: number): Milestone[] {
  // Logic: Higher complexity = longer phases
  // Base duration: 1 week per phase.
  // Multiplier: (Score / 20) weeks extra

  const multiplier = Math.max(1, Math.ceil(complexityScore / 25));

  return [
    {
      id: "phase1",
      title: "Phase 1: Foundation & Auth",
      duration: `Week 1-${multiplier}`,
      description:
        "Setup project structure, database schema, and implement secure authentication.",
      status: "pending",
    },
    {
      id: "phase2",
      title: "Phase 2: Core Features (MVP)",
      duration: `Week ${multiplier + 1}-${multiplier * 2 + 1}`,
      description:
        "Build the primary CRUD operations and core value delivery logic.",
      status: "pending",
    },
    {
      id: "phase3",
      title: "Phase 3: Polish & Launch",
      duration: `Week ${multiplier * 2 + 2}-${multiplier * 3}`,
      description:
        "UI polish, micro-animations, and final QA testing before deployment.",
      status: "pending",
    },
  ];
}

// 3. Tech Stack Recommendation
export interface TechStackRecommendation {
  title: string;
  description: string;
  stack: { category: string; name: string; iconName: string }[];
}

export function recommendTechStack(
  projectType: string = "saas",
  teamSize: string = "solo",
): TechStackRecommendation {
  if (projectType === "saas" && teamSize === "solo") {
    return {
      title: "The Rapid Launcher Stack",
      description:
        "Optimized for speed and shipping. Minimize infrastructure management.",
      stack: [
        {
          category: "Frontend",
          name: "Next.js (App Router)",
          iconName: "Code2",
        },
        {
          category: "Database",
          name: "Supabase (Postgres)",
          iconName: "Database",
        },
        { category: "Styling", name: "Tailwind CSS", iconName: "Layers" },
        { category: "Deployment", name: "Vercel", iconName: "Server" },
      ],
    };
  }

  if (projectType === "mobile") {
    return {
      title: "The Cross-Platform Mobile Stack",
      description:
        "Build native apps for iOS and Android from a single codebase.",
      stack: [
        {
          category: "Framework",
          name: "React Native / Expo",
          iconName: "Code2",
        },
        { category: "Backend", name: "Supabase", iconName: "Database" },
        { category: "Styling", name: "NativeWind", iconName: "Layers" },
        { category: "Distrib", name: "EAS Build", iconName: "Server" },
      ],
    };
  }

  // Default / Enterprise
  return {
    title: "The Scalable Enterprise Stack",
    description: "Robust, type-safe, and ready for high traffic.",
    stack: [
      { category: "Frontend", name: "React + Vite", iconName: "Code2" },
      { category: "Backend", name: "Node.js + NestJS", iconName: "Server" },
      {
        category: "Database",
        name: "PostgreSQL + Prisma",
        iconName: "Database",
      },
      { category: "DevOps", name: "Docker + AWS ECS", iconName: "Layers" },
    ],
  };
}
