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
import {
  getCurrentUser,
  getUserAllConsumptionRecords,
  getUsersTotalConsumptionAmounts,
} from "@/lib/dal"

type DashboardPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      message: "You need to be signed in",
    }
  }

  const archiveDateRange = await getArchiveDateRangeFromSearchParams(
    searchParams,
    ARCHIVE_LIMIT,
  )

  const [
    waterLevel,
    averageWaterLevel,
    paginatedArchiveEntries,
    records,
    totals,
  ] = await Promise.all([
    getConsumptionAmountAction(formatDate(new Date())),
    getAverageConsumptionAmountAction(),
    getPaginatedArchiveEntriesAction(
      ARCHIVE_LIMIT,
      archiveDateRange.startDate,
      archiveDateRange.endDate,
    ),
    getUserAllConsumptionRecords(user.id),
    getUsersTotalConsumptionAmounts(),
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
      records={records}
      totals={totals}
    />
  )
}
