import { describe, expect, it } from "vitest"

import { obscureEmail } from "../../utils"

describe("obscureEmail", () => {
  it("keeps the first character of the local part and hides the rest", () => {
    expect(obscureEmail("john@example.com")).toBe("j***@example.com")
  })

  it("trims surrounding whitespace", () => {
    expect(obscureEmail("  alice@example.com  ")).toBe("a***@example.com")
  })

  it("handles a single-character local part", () => {
    expect(obscureEmail("a@example.com")).toBe("a***@example.com")
  })

  it("returns the original value when there is no @", () => {
    expect(obscureEmail("not-an-email")).toBe("not-an-email")
  })
})
