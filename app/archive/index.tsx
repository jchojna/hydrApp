import { ArchiveEntry } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface ArchiveProps {
  entries: ArchiveEntry[]
  onPrevious: () => void
  onNext: () => void
  disablePrevious: boolean
  disableNext: boolean
}

export default function Archive({
  entries,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
}: ArchiveProps) {
  return (
    <div className="flex flex-col gap-4">
      {entries.length ? (
        <div className="flex flex-col gap-2 text-sm">
          {entries.map((entry) => (
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
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={disablePrevious || !onPrevious}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={disableNext || !onNext}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
