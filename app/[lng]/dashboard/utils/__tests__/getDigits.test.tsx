import { describe, expect, it } from "vitest"

import { Digit0 } from "@/assets/svg/digits/digit-0"
import { Digit2 } from "@/assets/svg/digits/digit-2"

import { getDigits } from "../getDigits"

describe("getDigits", () => {
  it("returns two digit components with leading zero when needed", () => {
    const digits = getDigits(500, 250)

    expect(digits).toHaveLength(2)
    expect(digits[0].type).toBe(Digit0)
    expect(digits[1].type).toBe(Digit2)
    expect(digits[0].props.className).toBe("w-36 rounded-xl text-blue-300")
  })

  it("returns both digits for double-digit glass counts", () => {
    const digits = getDigits(2500, 250)

    expect(digits).toHaveLength(2)
    expect(digits[0].type).not.toBe(Digit0)
    expect(digits[1].type).toBe(Digit0)
  })
})
