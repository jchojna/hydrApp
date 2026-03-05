import { ArchiveEntry } from "@/lib/types"

interface ArchiveProps {
  archiveEntries: ArchiveEntry[]
}

export default function Archive({ archiveEntries }: ArchiveProps) {
  return (
    <div className="flex flex-col gap-4">
      {archiveEntries.length ? (
        <div className="flex flex-col gap-2 text-sm">
          {archiveEntries.map((entry) => (
            <div
              key={entry.date}
              className="text-blue-light-1 flex items-center justify-between"
            >
              <span>{entry.date}</span>
              <span>{entry.amount}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-blue-light-1 text-sm">No archive entries.</div>
      )}
    </div>
  )
}
