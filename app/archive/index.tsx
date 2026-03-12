import { ArchiveEntry, ArchivePageInfo } from "@/lib/types"
import { PaginationHeader } from "@/components/PaginationHeader"
import { Entry } from "./components/Entry"

interface ArchiveProps {
  entries: ArchiveEntry[]
  pageInfo: ArchivePageInfo
}

export default function Archive({ entries, pageInfo }: ArchiveProps) {
  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4">
      <PaginationHeader pageInfo={pageInfo} />
      <div className="flex flex-col gap-2 text-sm">
        {entries.length ? (
          entries.map((entry) => <Entry key={entry.date} entry={entry} />)
        ) : (
          <span>No archive entries for this date range.</span>
        )}
      </div>
    </div>
  )
}
