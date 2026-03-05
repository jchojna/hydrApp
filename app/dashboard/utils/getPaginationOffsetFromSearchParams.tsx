export type SearchParams = {
  archiveOffset?: string
}

export const getPaginationOffsetFromSearchParams = async (
  searchParams: Promise<SearchParams>,
  paramName: keyof SearchParams,
) => {
  const resolvedSearchParams = await searchParams
  const parsedOffset = Number.parseInt(
    resolvedSearchParams[paramName] || "0",
    10,
  )
  return Number.isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset
}
