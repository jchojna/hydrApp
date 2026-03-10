import { ArchivePageInfo } from "@/lib/types"
import useTablePagination from "@/hooks/useTablePagination"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/assets/svg/icons/arrow-left"
import { ArrowRightIcon } from "@/assets/svg/icons/arrow-right"
import { formatDatesRange } from "@/lib/utils"

interface PaginationHeaderProps {
  pageInfo: ArchivePageInfo
}

export const PaginationHeader = ({ pageInfo }: PaginationHeaderProps) => {
  const {
    handleNextArchivePage,
    handlePreviousArchivePage,
    disableNext,
    disablePrevious,
  } = useTablePagination(pageInfo)

  return (
    <div className="bg-blue-dark-3 flex items-center justify-between gap-2 rounded-2xl">
      <Button
        className="text-blue-light-1 hover:bg-blue-dark-3 hover:text-blue-light-3"
        variant="ghost"
        size="sm"
        onClick={handlePreviousArchivePage}
        disabled={disablePrevious || !handlePreviousArchivePage}
      >
        <ArrowLeftIcon />
      </Button>
      <span className="text-blue-light-3">
        {formatDatesRange(pageInfo.startDate, pageInfo.endDate)}
      </span>
      <Button
        className="text-blue-light-1 hover:bg-blue-dark-3 hover:text-blue-light-3"
        variant="ghost"
        size="sm"
        onClick={handleNextArchivePage}
        disabled={disableNext || !handleNextArchivePage}
      >
        <ArrowRightIcon />
      </Button>
    </div>
  )
}
