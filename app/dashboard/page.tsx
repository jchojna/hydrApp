import {
  getAverageConsumptionAmountAction,
  getConsumptionAmountAction,
} from "@/actions/consumption"
import Dashboard from "./components/Dashboard"
import DashboardErrorToasts from "./components/DashboardErrorToasts"
import { formatDate } from "@/lib/utils"
import { getPaginatedArchiveEntriesAction } from "@/actions/archive"
import {
  getArchiveDateRangeFromSearchParams,
  type SearchParams,
} from "./utils/getArchiveDateRangeFromSearchParams"
import { ARCHIVE_LIMIT } from "@/lib/constants"
import { getCurrentUser } from "@/lib/dal/user"
import { getUserSettings } from "@/lib/dal/settings"
import { unauthorizedActionResponse } from "@/lib/errors"

type DashboardPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getCurrentUser()
  if (!user) return unauthorizedActionResponse

  const archiveDateRange = await getArchiveDateRangeFromSearchParams(
    searchParams,
    ARCHIVE_LIMIT,
  )

  const [
    waterLevel,
    averageWaterLevel,
    paginatedArchiveEntries,
    userSettingsResponse,
  ] = await Promise.all([
    getConsumptionAmountAction(formatDate(new Date())),
    getAverageConsumptionAmountAction(),
    getPaginatedArchiveEntriesAction(
      ARCHIVE_LIMIT,
      archiveDateRange.startDate,
      archiveDateRange.endDate,
    ),
    getUserSettings(user.id),
  ])

  if (
    !waterLevel.success ||
    !paginatedArchiveEntries.success ||
    !averageWaterLevel.success ||
    !userSettingsResponse.success
  ) {
    const errors: string[] = []
    if (!waterLevel.success) {
      errors.push(`Failed to fetch water level: ${waterLevel.message}`)
    }
    if (!paginatedArchiveEntries.success) {
      errors.push(
        `Failed to fetch archive entries: ${paginatedArchiveEntries.message}`,
      )
    }
    if (!averageWaterLevel.success) {
      errors.push(
        `Failed to fetch average water level: ${averageWaterLevel.message}`,
      )
    }
    if (!userSettingsResponse.success) {
      errors.push(
        `Failed to fetch user settings: ${userSettingsResponse.message}`,
      )
    }

    return <DashboardErrorToasts errors={errors} />
  }

  return (
    <Dashboard
      waterLevel={waterLevel.data}
      averageWaterLevel={averageWaterLevel.data}
      archiveEntries={paginatedArchiveEntries.data?.entries || []}
      archivePageInfo={paginatedArchiveEntries.data.pageInfo}
      userSettings={userSettingsResponse.data}
    />
  )
}
