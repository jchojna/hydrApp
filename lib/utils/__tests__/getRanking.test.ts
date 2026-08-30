import { describe, expect, it } from "vitest"

import { getRanking } from "../getRanking"

describe("getRanking", () => {
  it("returns an empty array when totals are undefined", () => {
    expect(getRanking(undefined, 2)).toEqual([])
  })

  it("maps, sorts and formats ranking entries", () => {
    const ranking = getRanking(
      [
        {
          userId: "b-user",
          username: "",
          email: "john@example.com",
          totalAmount: "2",
        },
        {
          userId: "a-user",
          username: "Alice",
          email: "alice@example.com",
          totalAmount: "2",
        },
        {
          userId: "c-user",
          username: "Chris",
          email: "chris@example.com",
          totalAmount: "3",
        },
      ],
      2,
    )

    expect(ranking).toEqual([
      {
        userId: "c-user",
        username: "Chris",
        points: "1.50",
      },
      {
        userId: "a-user",
        username: "Alice",
        points: "1.00",
      },
      {
        userId: "b-user",
        username: "j***@example.com",
        points: "1.00",
      },
    ])
  })
})
