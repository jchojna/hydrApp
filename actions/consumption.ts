"use server"

import { getCurrentUser, upsertConsumptionRecord } from "@/lib/dal"
import { ActionResponse } from "./types"

type SaveConsumptionInput = {
  amount: number
  date: string
}

export async function saveConsumptionAction(
  input: SaveConsumptionInput,
): Promise<ActionResponse> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300)) // TODO: remove this

    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "You need to be signed in",
      }
    }

    await upsertConsumptionRecord(user.id, input.amount, input.date)

    return {
      success: true,
      message: "Consumption saved successfully",
    }
  } catch (error) {
    console.error("Save consumption error:", error)
    return {
      success: false,
      message: "An error occurred while saving consumption",
    }
  }
}
