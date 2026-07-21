import { describe, it, expect } from "vitest";
import { dashboardData } from "@/theme-dashboard/data";
import { sectionRenderers } from "@/theme-dashboard/components/sectionRenderers";

describe("theme-dashboard-smoke", () => {
  it("registers the preview-diff section", () => {
    expect(typeof (sectionRenderers as Record<string, unknown>)["preview-diff"]).toBe("function");
  });

  it("dashboard data includes architecture edges", () => {
    expect(dashboardData.architecture.length).toBeGreaterThan(0);
  });

  it("preview-diff data includes expected theme token structure", () => {
    const tokens = dashboardData.themeTokens as Record<string, unknown>;
    const colors = tokens.colors as Record<string, string> | undefined;
    const rounded = tokens.rounded as Record<string, string> | undefined;
    expect(colors).toBeTruthy();
    expect(rounded).toBeTruthy();
    expect(colors?.primary).toBe("#0056D2");
    expect(rounded?.DEFAULT).toBe("0.5rem");
  });
});
