import { describe, it, expect } from "vitest";
import { FEATURE_CATEGORIES } from "./features";

describe("Feature Config", () => {
  it("should have unique feature IDs across all categories", () => {
    const allFeatureIds = FEATURE_CATEGORIES.flatMap((c) =>
      c.features.map((f) => f.id),
    );
    const uniqueIds = new Set(allFeatureIds);
    expect(uniqueIds.size).toBe(allFeatureIds.length);
  });

  it("should have positive costs for all features", () => {
    FEATURE_CATEGORIES.forEach((category) => {
      category.features.forEach((feature) => {
        expect(feature.cost).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it("should have valid categories", () => {
    const validCategories = ["auth", "core", "monetization"];
    FEATURE_CATEGORIES.forEach((category) => {
      expect(validCategories).toContain(category.id);
    });
  });

  it("should contain essential features", () => {
    const allFeatureIds = FEATURE_CATEGORIES.flatMap((c) =>
      c.features.map((f) => f.id),
    );
    expect(allFeatureIds).toContain("email_pass");
    expect(allFeatureIds).toContain("stripe");
  });
});
