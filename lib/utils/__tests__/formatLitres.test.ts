import { describe, expect, it } from "vitest"

import { formatLitres } from "../formatLitres"

describe("formatLitres", () => {
  it("formats numeric values", () => {
    expect(formatLitres(2.5)).toBe("2.5 L")
  })

  it("formats string values", () => {
    expect(formatLitres("1")).toBe("1 L")
  })
})
