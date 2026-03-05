import { ArchivePageInfo } from "@/lib/types"
import { useRouter, useSearchParams } from "next/navigation"

export default function useTablePagination(pageInfo: ArchivePageInfo) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToArchiveOffset = (offset: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (offset <= 0) {
      params.delete("archiveOffset")
    } else {
      params.set("archiveOffset", offset.toString())
    }
    const query = params.toString()
    router.push(query ? `/dashboard?${query}` : "/dashboard")
  }

  const handleNextArchivePage = () => {
    if (!pageInfo.hasNextPage) return
    navigateToArchiveOffset(pageInfo.offset + pageInfo.limit)
  }

  const handlePreviousArchivePage = () => {
    if (pageInfo.offset <= 0) return
    navigateToArchiveOffset(Math.max(0, pageInfo.offset - pageInfo.limit))
  }

  const disableNext = !pageInfo.hasNextPage
  const disablePrevious = pageInfo.offset <= 0

  return {
    handleNextArchivePage,
    handlePreviousArchivePage,
    disableNext,
    disablePrevious,
  }
}
