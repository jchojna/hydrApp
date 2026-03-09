export type ArchiveEntry = {
  date: string
  amount: string
}

export type ArchivePageInfo = {
  limit: number
  startDate: string
  endDate: string
  hasPreviousPage: boolean
  hasNextPage: boolean
  previousStartDate: string | null
  previousEndDate: string | null
  nextStartDate: string | null
  nextEndDate: string | null
}

export type PaginatedArchiveEntries = {
  entries: ArchiveEntry[]
  pageInfo: ArchivePageInfo
}
