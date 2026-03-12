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
      className="text-blue-light-1 hover:bg-blue-dark-2 hover:text-blue-light-3 flex h-8 w-8 items-center justify-center rounded-full"
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
    <div className="bg-blue-dark-3 flex items-center justify-center gap-2 rounded-full p-1">
      {onPreviousPage && (
        <ArrowButton
          onClick={onPreviousPage}
          disabled={!!isPreviousPageDisabled}
          icon={<ArrowLeftIcon />}
        />
      )}
      <span className="text-blue-light-3 flex-1 text-center">{title}</span>
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
