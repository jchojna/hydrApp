import { describe, expect, it } from "vitest"

import { clampWaterLevel } from "../clampWaterLevel"

describe("clampWaterLevel", () => {
  it("clamps below zero", () => {
    expect(clampWaterLevel(-1, 2)).toBe(0)
  })

  it("clamps above max water per day", () => {
    expect(clampWaterLevel(3, 2)).toBe(2)
  })

  it("returns value in range", () => {
    expect(clampWaterLevel(1.5, 2)).toBe(1.5)
  })
})
