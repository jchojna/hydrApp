"use server"

import {
  getAverageConsumptionAmountSinceFirstRecord,
  getConsumptionAmount,
  upsertConsumptionRecord,
} from "@/lib/dal/consumption"
import { getCurrentUser } from "@/lib/dal/user"
import { ActionResponse } from "./types"
import { unauthorizedActionResponse } from "@/lib/errors"

type SaveConsumptionInput = {
  amount: number
  date: string
}

export async function saveConsumptionAction(
  input: SaveConsumptionInput,
): Promise<ActionResponse> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200)) // TODO: remove this

    const user = await getCurrentUser()
    if (!user) return unauthorizedActionResponse

    await upsertConsumptionRecord(user.id, input.amount, input.date)

    return {
      success: true,
      message: "Consumption saved successfully",
      data: null,
    }
  } catch (error) {
    console.error("Save consumption error:", error)
    return {
      success: false,
      message: "An error occurred while saving consumption",
    }
  }
}

export async function getConsumptionAmountAction(
  date: string,
): Promise<ActionResponse<number>> {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorizedActionResponse

    const amount = await getConsumptionAmount(user.id, date)
    return {
      success: true,
      message: "Consumption amount retrieved successfully",
      data: amount,
    }
  } catch (error) {
    console.error("Get consumption amount error:", error)
    return {
      success: false,
      message: "An error occurred while getting consumption amount",
    }
  }
}

export async function getAverageConsumptionAmountAction(): Promise<
  ActionResponse<number>
> {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorizedActionResponse

    const averageAmount = await getAverageConsumptionAmountSinceFirstRecord(
      user.id,
    )
    return {
      success: true,
      message: "Average consumption amount retrieved successfully",
      data: averageAmount,
    }
  } catch (error) {
    console.error("Get average consumption amount error:", error)
    return {
      success: false,
      message: "An error occurred while getting average consumption amount",
    }
  }
}
