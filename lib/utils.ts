import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export const formatDate = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const shiftDate = (date: string, days: number) => {
  const parsedDate = parseDate(date)
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days)
  return formatDate(parsedDate)
}

export const formatDatesRange = (startDate: string, endDate: string) => {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
  })

  const startYear = start.getUTCFullYear()
  const endYear = end.getUTCFullYear()
  const startMonth = start.getUTCMonth()
  const endMonth = end.getUTCMonth()
  const startDay = start.getUTCDate()
  const endDay = end.getUTCDate()

  const startMonthName = monthFormatter.format(start)
  const endMonthName = monthFormatter.format(end)

  if (startYear === endYear && startMonth === endMonth) {
    return `${startMonthName} ${startDay} - ${endDay}, ${startYear}`
  }

  if (startYear === endYear) {
    return `${startMonthName} ${startDay} - ${endMonthName} ${endDay}, ${startYear}`
  }

  return `${startMonthName} ${startDay}, ${startYear} - ${endMonthName} ${endDay}, ${endYear}`
}

export const formatDays = (days: number) => {
  return `${days} day${days === 1 ? "" : "s"}`
}
