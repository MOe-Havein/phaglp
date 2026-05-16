import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("should merge tailwind classes correctly", () => {
    expect(cn("px-2 py-2", "bg-red-500")).toBe("px-2 py-2 bg-red-500")
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})
