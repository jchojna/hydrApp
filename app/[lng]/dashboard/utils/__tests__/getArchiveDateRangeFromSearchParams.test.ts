import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getArchiveDateRangeFromSearchParams } from "../getArchiveDateRangeFromSearchParams"

describe("getArchiveDateRangeFromSearchParams", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-30T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns provided range when both dates are valid and match the limit", async () => {
    const range = await getArchiveDateRangeFromSearchParams(
      Promise.resolve({
        archiveStartDate: "2026-03-24",
        archiveEndDate: "2026-03-30",
      }),
      7,
    )

    expect(range).toEqual({
      startDate: "2026-03-24",
      endDate: "2026-03-30",
    })
  })

  it("falls back to default range for invalid date format", async () => {
    const range = await getArchiveDateRangeFromSearchParams(
      Promise.resolve({
        archiveStartDate: "2026/03/24",
        archiveEndDate: "2026-03-30",
      }),
      7,
    )

    expect(range).toEqual({
      startDate: "2026-03-24",
      endDate: "2026-03-30",
    })
  })

  it("falls back to default range when end date does not match limit", async () => {
    const range = await getArchiveDateRangeFromSearchParams(
      Promise.resolve({
        archiveStartDate: "2026-03-24",
        archiveEndDate: "2026-03-29",
      }),
      7,
    )

    expect(range).toEqual({
      startDate: "2026-03-24",
      endDate: "2026-03-30",
    })
  })
})
