import { PaginatedArchiveEntries } from "@/lib/types"
import { PaginationHeader } from "@/components/PaginationHeader"
import { Entry } from "./components/Entry"
import useTablePagination from "@/hooks/useTablePagination"
import { formatDatesRange } from "@/lib/utils"
import { useSettings } from "@/providers/SettingsContext"
import { SidebarSection } from "@/components/SidebarSection"

export default function Archive({
  entries,
  pageInfo,
}: PaginatedArchiveEntries) {
  const {
    settings: { glassVolume, maxWaterPerDay },
  } = useSettings()
  const {
    handleNextArchivePage,
    handlePreviousArchivePage,
    disableNext,
    disablePrevious,
  } = useTablePagination(pageInfo)

  return (
    <SidebarSection>
      <PaginationHeader
        title={formatDatesRange(pageInfo.startDate, pageInfo.endDate)}
        onNextPage={handleNextArchivePage}
        onPreviousPage={handlePreviousArchivePage}
        isNextPageDisabled={disableNext}
        isPreviousPageDisabled={disablePrevious}
      />
      <ul className="flex flex-col gap-2 text-sm">
        {entries.length ? (
          entries.map((entry) => (
            <Entry
              key={entry.date}
              entry={entry}
              glassVolume={glassVolume}
              maxWaterPerDay={maxWaterPerDay}
            />
          ))
        ) : (
          <li>No archive entries for this date range.</li>
        )}
      </ul>
    </SidebarSection>
  )
}
