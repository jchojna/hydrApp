export type ArchiveEntry = {
  date: string
  amount: string
}

export type ArchivePageInfo = {
  limit: number
  offset: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  previousOffset: number
  nextOffset: number | null
}

export type PaginatedArchiveEntries = {
  entries: ArchiveEntry[]
  pageInfo: ArchivePageInfo
}
