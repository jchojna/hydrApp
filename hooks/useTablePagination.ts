import { ArchivePageInfo } from "@/lib/types"
import { useRouter, useSearchParams } from "next/navigation"

export default function useTablePagination(pageInfo: ArchivePageInfo) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToArchiveDateRange = (startDate: string, endDate: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("archiveStartDate", startDate)
    params.set("archiveEndDate", endDate)

    const query = params.toString()
    router.push(query ? `/dashboard?${query}` : "/dashboard")
  }

  const handleNextArchivePage = () => {
    if (
      !pageInfo.hasNextPage ||
      !pageInfo.nextStartDate ||
      !pageInfo.nextEndDate
    ) {
      return
    }
    navigateToArchiveDateRange(pageInfo.nextStartDate, pageInfo.nextEndDate)
  }

  const handlePreviousArchivePage = () => {
    if (
      !pageInfo.hasPreviousPage ||
      !pageInfo.previousStartDate ||
      !pageInfo.previousEndDate
    ) {
      return
    }
    navigateToArchiveDateRange(
      pageInfo.previousStartDate,
      pageInfo.previousEndDate,
    )
  }

  const disableNext = !pageInfo.hasNextPage
  const disablePrevious = !pageInfo.hasPreviousPage

  return {
    handleNextArchivePage,
    handlePreviousArchivePage,
    disableNext,
    disablePrevious,
  }
}
