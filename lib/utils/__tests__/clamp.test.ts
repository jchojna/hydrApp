import { describe, expect, it } from "vitest"

import { clamp } from "../clamp"

describe("clamp", () => {
  it("clamps values below the minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it("clamps values above the maximum", () => {
    expect(clamp(12, 0, 10)).toBe(10)
  })

  it("returns value when within range", () => {
    expect(clamp(7, 0, 10)).toBe(7)
  })

  it("uses 0 as default minimum", () => {
    expect(clamp(-3, undefined, 10)).toBe(0)
  })
})
