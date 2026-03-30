import { describe, expect, it, vi } from "vitest"

import { easeOutCubic, getAnimatedTransitionValue } from "../animation"

describe("easeOutCubic", () => {
  it("returns boundary values", () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
  })

  it("eases faster than linear in the beginning", () => {
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875)
  })
})

describe("getAnimatedTransitionValue", () => {
  it("returns target when start is null", () => {
    expect(
      getAnimatedTransitionValue({
        timestamp: 1000,
        from: 0,
        to: 10,
        startedAt: null,
        durationMs: 200,
      }),
    ).toBe(10)
  })

  it("returns target when duration is non-positive", () => {
    expect(
      getAnimatedTransitionValue({
        timestamp: 1000,
        from: 0,
        to: 10,
        startedAt: 500,
        durationMs: 0,
      }),
    ).toBe(10)
  })

  it("applies delay and easing during the transition", () => {
    const result = getAnimatedTransitionValue({
      timestamp: 1200,
      from: 0,
      to: 100,
      startedAt: 1000,
      durationMs: 400,
      delayMs: 100,
      easing: (value) => value * value,
    })

    expect(result).toBeCloseTo(6.25)
  })

  it("calls onComplete and returns target after duration", () => {
    const onComplete = vi.fn()

    const result = getAnimatedTransitionValue({
      timestamp: 1500,
      from: 0,
      to: 100,
      startedAt: 1000,
      durationMs: 400,
      onComplete,
    })

    expect(result).toBe(100)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
