import { BurgerCircleIcon } from "@/assets/svg/icons/burger-circle"
import { cn } from "@/lib/utils"
import { useState } from "react"

export const BurgerButton = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive((prev) => !prev)
    onClick?.(e)
  }

  return (
    <button
      className={cn(
        className,
        "text-blue-light-1 hover:text-blue-light-3 transition-colors-transform w-14 cursor-pointer duration-300",
        isActive && "rotate-180 transform",
      )}
      onClick={handleClick}
      {...props}
    >
      <BurgerCircleIcon />
    </button>
  )
}
