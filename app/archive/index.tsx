import { ArchiveEntry, ArchivePageInfo } from "@/lib/types"
import { PaginationHeader } from "@/components/PaginationHeader"
import { Entry } from "./components/Entry"
import useTablePagination from "@/hooks/useTablePagination"
import { formatDatesRange } from "@/lib/utils"

interface ArchiveProps {
  entries: ArchiveEntry[]
  pageInfo: ArchivePageInfo
  glassVolume: number
  maxWaterPerDay: number
}

// TODO: cache archive entries
export default function Archive({
  entries,
  pageInfo,
  glassVolume,
  maxWaterPerDay,
}: ArchiveProps) {
  const {
    handleNextArchivePage,
    handlePreviousArchivePage,
    disableNext,
    disablePrevious,
  } = useTablePagination(pageInfo)

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4">
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
    </div>
  )
}
