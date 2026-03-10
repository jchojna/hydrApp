import { ArchivePageInfo } from "@/lib/types"
import useTablePagination from "@/hooks/useTablePagination"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/assets/svg/icons/arrow-left"
import { ArrowRightIcon } from "@/assets/svg/icons/arrow-right"
import { formatDatesRange } from "@/lib/utils"

type ArrowButtonProps = {
  onClick: () => void
  disabled: boolean
  icon: React.ReactNode
}

const ArrowButton = ({ onClick, disabled, icon }: ArrowButtonProps) => {
  return (
    <Button
      className="text-blue-light-1 hover:bg-blue-dark-2 hover:text-blue-light-3 rounded-full"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  )
}

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
    <div className="bg-blue-dark-3 flex items-center justify-between gap-2 rounded-2xl p-1">
      <ArrowButton
        onClick={handlePreviousArchivePage}
        disabled={disablePrevious || !handlePreviousArchivePage}
        icon={<ArrowLeftIcon />}
      />
      <span className="text-blue-light-3">
        {formatDatesRange(pageInfo.startDate, pageInfo.endDate)}
      </span>
      <ArrowButton
        onClick={handleNextArchivePage}
        disabled={disableNext || !handleNextArchivePage}
        icon={<ArrowRightIcon />}
      />
    </div>
  )
}
