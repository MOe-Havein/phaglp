import { describe, it, expect } from "vitest";
import { dashboardData } from "@/theme-dashboard/data";
import { sectionRenderers } from "@/theme-dashboard/components/sectionRenderers";

const extractText = (value: unknown): string => {
  if (value == null || typeof value === "boolean" || typeof value === "number") return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractText).join("");
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (obj.props && typeof obj.props === "object") {
      return extractText(obj.props.children) + extractText(obj.props.title);
    }
    return Object.values(obj).map(extractText).join("");
  }
  return String(value);
};

describe("theme-dashboard-smoke", () => {
  it("registers the preview-diff section", () => {
    expect(typeof (sectionRenderers as Record<string, unknown>)["preview-diff"]).toBe("function");
  });

  it("dashboard data includes architecture edges", () => {
    expect(dashboardData.architecture.length).toBeGreaterThan(0);
  });

  it("preview section returns a renderable React element", async () => {
    const fn = (sectionRenderers as Record<string, (props: { data: typeof dashboardData }) => unknown>)[
      "preview-diff"
    ];
    const result = fn({ data: dashboardData });
    expect(result).toBeTruthy();

    const text = extractText(result);
    expect(text).toContain("Before");
    expect(text).toContain("After");
    expect(text).toContain("--surface-container-low:");
    expect(text).toContain("0.75rem");
  });
});
