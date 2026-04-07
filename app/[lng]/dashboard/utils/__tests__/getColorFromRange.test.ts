import { describe, expect, it } from "vitest"

import { getColorFromRange } from "../getColorFromRange"

describe("getColorFromRange", () => {
  it("returns start color when percentage is below 0", () => {
    expect(getColorFromRange(-0.5, "#000000", "#ffffff")).toBe("#000000")
  })

  it("returns end color when percentage is above 1", () => {
    expect(getColorFromRange(2, "#000000", "#ffffff")).toBe("#ffffff")
  })

  it("interpolates colors at midpoint", () => {
    expect(getColorFromRange(0.5, "#000000", "#ffffff")).toBe("#808080")
  })

  it("supports shorthand hex values", () => {
    expect(getColorFromRange(0.5, "#f00", "#00f")).toBe("#800080")
  })

  it("throws for invalid hex colors", () => {
    expect(() => getColorFromRange(0.5, "#xyz", "#00f")).toThrow(
      "Invalid hex color provided: #xyz",
    )
  })
})
