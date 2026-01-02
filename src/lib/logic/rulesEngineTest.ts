import { describe, it, expect } from "vitest";
import {
  calculateComplexity,
  generateRoadmap,
  recommendTechStack,
} from "./rulesEngine";
import { PlanInputs } from "@/types/plan";

// Mock inputs
const simpleInputs: PlanInputs = {
  projectType: "saas", // "landing_page" not valid in current types, using minimal saas
  teamSize: "solo",
  features: [], // Empty features
};

describe("Rules Engine", () => {
  describe("calculateComplexity", () => {
    it("should return a number score", () => {
      // Pass array of feature IDs
      const score = calculateComplexity(simpleInputs.features || []);
      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("should return higher score for more features", () => {
      const lowScore = calculateComplexity([]);
      const highScore = calculateComplexity([
        "social",
        "realtime",
        "stripe",
        "marketplace",
      ]);
      expect(highScore).toBeGreaterThan(lowScore);
    });
  });

  describe("recommendTechStack", () => {
    it("should recommend Next.js/Tailwind for SaaS/Solo", () => {
      const recommendation = recommendTechStack("saas", "solo");
      expect(recommendation.title).toContain("Rapid Launcher");
      const stackNames = recommendation.stack.map((s) => s.name);
      expect(stackNames.some((n) => n.includes("Next.js"))).toBe(true);
      expect(stackNames.some((n) => n.includes("Supabase"))).toBe(true);
    });

    it("should recommend React Native for Mobile", () => {
      const recommendation = recommendTechStack("mobile", "small");
      expect(recommendation.title).toContain("Mobile");
      const stackNames = recommendation.stack.map((s) => s.name);
      expect(stackNames.some((n) => n.includes("React Native"))).toBe(true);
    });
  });

  describe("generateRoadmap", () => {
    it("should generate phases based on complexity score", () => {
      const lowComplexityMap = generateRoadmap(10);
      const highComplexityMap = generateRoadmap(90);

      expect(lowComplexityMap.length).toBe(3);
      expect(highComplexityMap.length).toBe(3);

      // High complexity should have longer duration strings
      expect(lowComplexityMap[0].duration).toContain("Week 1-1");
      expect(highComplexityMap[0].duration).toContain("Week 1-4");
    });
  });
});
