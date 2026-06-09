import { describe, expect, it } from "vitest"

import { getStreaks } from "../getStreaks"

describe("getStreaks", () => {
  it("returns zeros and null ranges when there are no records", () => {
    expect(getStreaks("2026-03-30")).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      currentStreakRange: null,
      lastLongestStreakRange: null,
    })
  })

  it("tracks an active streak through today", () => {
    expect(
      getStreaks("2026-03-30", [
        { date: "2026-03-27", amount: "0.5" },
        { date: "2026-03-28", amount: "1.0" },
        { date: "2026-03-29", amount: "0.4" },
        { date: "2026-03-30", amount: "1.2" },
      ]),
    ).toEqual({
      currentStreak: 4,
      longestStreak: 4,
      currentStreakRange: {
        startDate: "2026-03-27",
        endDate: "2026-03-30",
      },
      lastLongestStreakRange: {
        startDate: "2026-03-27",
        endDate: "2026-03-30",
      },
    })
  })

  it("uses the most recent longest streak range when streak lengths tie", () => {
    expect(
      getStreaks("2026-03-30", [
        { date: "2026-03-24", amount: "1" },
        { date: "2026-03-25", amount: "1" },
        { date: "2026-03-26", amount: "0" },
        { date: "2026-03-27", amount: "1" },
        { date: "2026-03-28", amount: "1" },
        { date: "2026-03-29", amount: "0" },
        { date: "2026-03-30", amount: "0" },
      ]),
    ).toEqual({
      currentStreak: 0,
      longestStreak: 2,
      currentStreakRange: null,
      lastLongestStreakRange: {
        startDate: "2026-03-27",
        endDate: "2026-03-28",
      },
    })
  })
})
