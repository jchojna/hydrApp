"use server"

import {
  getUserAllConsumptionRecords,
  getUsersTotalConsumptionAmounts,
} from "@/lib/dal/consumption"
import { getCurrentUser } from "@/lib/dal/user"
import { ActionResponse } from "./types"
import { ConsumptionRecord, UserTotalConsumptionAmount } from "@/lib/types"
import { unauthorizedActionResponse } from "@/lib/errors"

type StatsData = {
  records: ConsumptionRecord[]
  totals: UserTotalConsumptionAmount[]
}

export async function getStatsDataAction(): Promise<ActionResponse<StatsData>> {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorizedActionResponse

    const [records, totals] = await Promise.all([
      getUserAllConsumptionRecords(user.id),
      getUsersTotalConsumptionAmounts(),
    ])

    return {
      success: true,
      message: "Stats data retrieved successfully",
      data: {
        records,
        totals,
      },
    }
  } catch (error) {
    console.error("Get stats data error:", error)
    return {
      success: false,
      message: "An error occurred while getting stats data",
    }
  }
}
