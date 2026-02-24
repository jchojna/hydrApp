import { BurgerCircleIcon } from "@/assets/svg/icons/burger-circle"
import { cn } from "@/lib/utils"

// TODO: use IconButton
export const BurgerButton = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        className,
        "text-blue-light-1 hover:text-blue-light-3 transition-colors-transform w-14 cursor-pointer duration-300",
      )}
      onClick={onClick}
      {...props}
    >
      <BurgerCircleIcon />
    </button>
  )
}
