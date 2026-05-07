import { parseDate } from "@/lib/utils"

type EntryDateProps = {
  date: string
}

// TODO: reuse for entry amount
export const EntryDate = ({ date }: EntryDateProps) => {
  const parsedDate = parseDate(date)
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(parsedDate)

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsedDate)

  return (
    <div className="flex flex-1 flex-col pl-2">
      <span className="text-sm text-blue-100">{formattedDate}</span>
      <span className="text-xs font-medium text-blue-200">{weekday}</span>
    </div>
  )
}
