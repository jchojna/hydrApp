import { describe, expect, it } from "vitest"

import { SCORE_LEVELS } from "@/lib/constants"

import { getScoreLevel, getScoreLevelIndex } from "../getScoreLevel"

describe("getScoreLevelIndex", () => {
  it("returns first score level for zero water level", () => {
    expect(getScoreLevelIndex(0, 2)).toBe(0)
  })

  it("returns the last score level when reaching or exceeding max", () => {
    const lastIndex = SCORE_LEVELS.length - 1

    expect(getScoreLevelIndex(2, 2)).toBe(lastIndex)
    expect(getScoreLevelIndex(3, 2)).toBe(lastIndex)
  })
})

describe("getScoreLevel", () => {
  it("returns the score object for a computed index", () => {
    const level = getScoreLevel(1, 2)

    expect(level).toBe(SCORE_LEVELS[4])
  })
})
