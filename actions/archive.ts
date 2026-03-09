"use server"

import { getCurrentUser, getPaginatedArchiveEntries } from "@/lib/dal"
import { ActionResponse } from "./types"
import { type PaginatedArchiveEntries } from "@/lib/types"

export const getPaginatedArchiveEntriesAction = async (
  limit: number,
  startDate: string,
  endDate: string,
): Promise<ActionResponse<PaginatedArchiveEntries>> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "You need to be signed in",
      }
    }

    const archiveEntries = await getPaginatedArchiveEntries(
      user.id,
      limit,
      startDate,
      endDate,
    )

    return {
      success: true,
      message: "Paginated archive entries retrieved successfully",
      data: archiveEntries,
    }
  } catch (error) {
    console.error("Get paginated archive entries error:", error)
    return {
      success: false,
      message: "An error occurred while getting paginated archive entries",
    }
  }
}
