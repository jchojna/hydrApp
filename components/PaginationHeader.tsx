import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/assets/svg/icons/arrow-left"
import { ArrowRightIcon } from "@/assets/svg/icons/arrow-right"

type ArrowButtonProps = {
  onClick: () => void
  disabled: boolean
  icon: React.ReactNode
}

const ArrowButton = ({ onClick, disabled, icon }: ArrowButtonProps) => {
  return (
    <Button
      className="flex h-8 w-8 items-center justify-center rounded-full text-blue-100 hover:bg-blue-300 hover:text-blue-50"
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
  title: string
  onNextPage?: () => void
  onPreviousPage?: () => void
  isNextPageDisabled?: boolean
  isPreviousPageDisabled?: boolean
}

export const PaginationHeader = ({
  title,
  onNextPage,
  onPreviousPage,
  isNextPageDisabled,
  isPreviousPageDisabled,
}: PaginationHeaderProps) => {
  return (
    <div className="flex h-10 items-center justify-center gap-2 rounded-full bg-blue-300/50 p-1">
      {onPreviousPage && (
        <ArrowButton
          onClick={onPreviousPage}
          disabled={!!isPreviousPageDisabled}
          icon={<ArrowLeftIcon />}
        />
      )}
      <span className="flex-1 text-center text-blue-100">{title}</span>
      {onNextPage && (
        <ArrowButton
          onClick={onNextPage}
          disabled={!!isNextPageDisabled}
          icon={<ArrowRightIcon />}
        />
      )}
    </div>
  )
}
