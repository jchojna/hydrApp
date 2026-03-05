import { getConsumptionAmountAction } from "@/actions/consumption"
import Dashboard from "./components/Dashboard"
import { formatDate } from "./utils/formatDate"
import { getPaginatedArchiveEntriesAction } from "@/actions/archive"
import {
  getPaginationOffsetFromSearchParams,
  type SearchParams,
} from "./utils/getPaginationOffsetFromSearchParams"
import { ARCHIVE_LIMIT, DEFAULT_ARCHIVE_PAGE_INFO } from "./utils/constants"

type DashboardPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const archiveOffset = await getPaginationOffsetFromSearchParams(
    searchParams,
    "archiveOffset",
  )

  const [waterLevel, paginatedArchiveEntries] = await Promise.all([
    getConsumptionAmountAction(formatDate(new Date())),
    getPaginatedArchiveEntriesAction(ARCHIVE_LIMIT, archiveOffset),
  ])

  if (!waterLevel.success) {
    return <div>Error: {waterLevel.message}</div>
  }

  if (!paginatedArchiveEntries.success) {
    return <div>Error: {paginatedArchiveEntries.message}</div>
  }

  return (
    <Dashboard
      waterLevel={Number(waterLevel.data)}
      archiveEntries={paginatedArchiveEntries.data?.entries || []}
      archivePageInfo={
        paginatedArchiveEntries.data?.pageInfo || DEFAULT_ARCHIVE_PAGE_INFO
      }
    />
  )
}
