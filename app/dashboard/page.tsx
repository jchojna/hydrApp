import {
  getAverageConsumptionAmountAction,
  getConsumptionAmountAction,
} from "@/actions/consumption"
import Dashboard from "./components/Dashboard"
import { formatDate } from "@/lib/utils"
import { getPaginatedArchiveEntriesAction } from "@/actions/archive"
import {
  getArchiveDateRangeFromSearchParams,
  type SearchParams,
} from "./utils/getArchiveDateRangeFromSearchParams"
import { ARCHIVE_LIMIT, DEFAULT_ARCHIVE_PAGE_INFO } from "@/lib/constants"
import { getCurrentUser } from "@/lib/dal"
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

  const [waterLevel, averageWaterLevel, paginatedArchiveEntries] =
    await Promise.all([
      getConsumptionAmountAction(formatDate(new Date())),
      getAverageConsumptionAmountAction(),
      getPaginatedArchiveEntriesAction(
        ARCHIVE_LIMIT,
        archiveDateRange.startDate,
        archiveDateRange.endDate,
      ),
    ])

  if (!waterLevel.success) {
    return <div>Error: {waterLevel.message}</div>
  }

  if (!paginatedArchiveEntries.success) {
    return <div>Error: {paginatedArchiveEntries.message}</div>
  }

  if (!averageWaterLevel.success) {
    return <div>Error: {averageWaterLevel.message}</div>
  }

  return (
    <Dashboard
      waterLevel={waterLevel.data}
      averageWaterLevel={averageWaterLevel.data}
      archiveEntries={paginatedArchiveEntries.data?.entries || []}
      archivePageInfo={
        paginatedArchiveEntries.data?.pageInfo || DEFAULT_ARCHIVE_PAGE_INFO
      }
    />
  )
}
