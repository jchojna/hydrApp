import { parseDate } from "@/lib/utils"

type EntryDateProps = {
  date: string
}

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
      <span className="text-blue-light-3 text-sm">{formattedDate}</span>
      <span className="text-blue-dark-5 text-xs">{weekday}</span>
    </div>
  )
}
