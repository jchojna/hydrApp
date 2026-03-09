import { formatDate, parseDate, shiftDate } from "@/lib/utils"

export type SearchParams = {
  archiveStartDate?: string
  archiveEndDate?: string
}

type ArchiveDateRange = {
  startDate: string
  endDate: string
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const isValidDate = (value?: string): value is string => {
  if (!value || !DATE_PATTERN.test(value)) return false
  const parsedDate = parseDate(value)
  return !Number.isNaN(parsedDate.getTime()) && formatDate(parsedDate) === value
}

const getDefaultRange = (limit: number): ArchiveDateRange => {
  const endDate = formatDate(new Date())
  const startDate = shiftDate(endDate, -(limit - 1))

  return { startDate, endDate }
}

export const getArchiveDateRangeFromSearchParams = async (
  searchParams: Promise<SearchParams>,
  limit: number,
): Promise<ArchiveDateRange> => {
  const resolvedSearchParams = await searchParams
  const startDate = resolvedSearchParams.archiveStartDate
  const endDate = resolvedSearchParams.archiveEndDate

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return getDefaultRange(limit)
  }

  const expectedEndDate = shiftDate(startDate, limit - 1)
  if (expectedEndDate !== endDate) {
    return getDefaultRange(limit)
  }

  return { startDate, endDate }
}
