import { describe, expect, it } from "vitest"

import {
  MAX_GLASS_VOLUME,
  MAX_USER_AGE,
  MAX_WATER_LIMIT,
} from "@/lib/constants"

import { normalizeUserSetting } from "../normalizeUserSetting"

describe("normalizeUserSetting", () => {
  it("trims and limits username length", () => {
    const value = `  ${"a".repeat(300)}  `
    const normalized = normalizeUserSetting({ key: "username", value })

    expect(normalized).toEqual({ key: "username", value: "a".repeat(255) })
  })

  it("rounds and clamps age", () => {
    expect(normalizeUserSetting({ key: "age", value: 18.6 })).toEqual({
      key: "age",
      value: 19,
    })
    expect(normalizeUserSetting({ key: "age", value: -10 })).toEqual({
      key: "age",
      value: 0,
    })
    expect(
      normalizeUserSetting({ key: "age", value: MAX_USER_AGE + 10 }),
    ).toEqual({ key: "age", value: MAX_USER_AGE })
  })

  it("accepts valid sex and falls back to other for invalid values", () => {
    expect(normalizeUserSetting({ key: "sex", value: "female" })).toEqual({
      key: "sex",
      value: "female",
    })

    expect(
      normalizeUserSetting({ key: "sex", value: "invalid" as never }),
    ).toEqual({ key: "sex", value: "other" })
  })

  it("clamps maxWaterPerDay and keeps two decimal precision", () => {
    expect(normalizeUserSetting({ key: "maxWaterPerDay", value: -1 })).toEqual({
      key: "maxWaterPerDay",
      value: 0,
    })

    expect(
      normalizeUserSetting({
        key: "maxWaterPerDay",
        value: MAX_WATER_LIMIT + 5,
      }),
    ).toEqual({ key: "maxWaterPerDay", value: MAX_WATER_LIMIT })

    expect(
      normalizeUserSetting({ key: "maxWaterPerDay", value: 1.239 }),
    ).toEqual({ key: "maxWaterPerDay", value: 1.24 })
  })

  it("clamps glassVolume and keeps two decimal precision", () => {
    expect(normalizeUserSetting({ key: "glassVolume", value: -1 })).toEqual({
      key: "glassVolume",
      value: 0,
    })

    expect(
      normalizeUserSetting({ key: "glassVolume", value: MAX_GLASS_VOLUME + 5 }),
    ).toEqual({ key: "glassVolume", value: MAX_GLASS_VOLUME })

    expect(normalizeUserSetting({ key: "glassVolume", value: 0.456 })).toEqual({
      key: "glassVolume",
      value: 0.46,
    })
  })
})
