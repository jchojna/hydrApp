import { ArchiveEntry, ArchivePageInfo } from "@/lib/types"
import { EmojiIcon } from "@/components/EmojiIcon"
import { MAX_WATER_PER_DAY } from "@/lib/constants"
import { PaginationHeader } from "@/components/PaginationHeader"

interface ArchiveProps {
  entries: ArchiveEntry[]
  pageInfo: ArchivePageInfo
}

export default function Archive({ entries, pageInfo }: ArchiveProps) {
  return (
    <div className="flex flex-col gap-4">
      <PaginationHeader pageInfo={pageInfo} />
      {entries.length ? (
        <div className="flex flex-col gap-2 text-sm">
          {entries.map((entry) => {
            const waterLevel = Number(entry.amount)

            return (
              <div
                key={entry.date}
                className="text-blue-light-1 flex items-center justify-between"
              >
                <span>{entry.date}</span>
                <span>{entry.amount}</span>
                <EmojiIcon
                  className="w-6"
                  waterLevel={waterLevel}
                  maxWaterPerDay={MAX_WATER_PER_DAY}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-blue-light-1 text-sm">No archive entries.</div>
      )}
    </div>
  )
}
