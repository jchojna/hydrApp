import { getConsumptionAmountAction } from "@/actions/consumption"
import Dashboard from "./components/Dashboard"
import { formatDate } from "./utils/formatDate"
import { getPaginatedArchiveEntriesAction } from "@/actions/archive"

export default async function DashboardPage() {
  const [waterLevel, paginatedArchiveEntries] = await Promise.all([
    getConsumptionAmountAction(formatDate(new Date())),
    getPaginatedArchiveEntriesAction(7, 0),
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
      archiveEntries={paginatedArchiveEntries.data || []}
    />
  )
}
