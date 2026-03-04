const DATE_FORMATTER_LOCALE = "en-US"

export const formatDate = (
  date: Date,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
) => {
  const parts = new Intl.DateTimeFormat(DATE_FORMATTER_LOCALE, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value

  if (!year || !month || !day) {
    throw new Error("Failed to format date")
  }

  return `${year}-${month}-${day}`
}
