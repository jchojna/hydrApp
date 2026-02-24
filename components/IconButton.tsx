import { cn } from "@/lib/utils"
import { useState } from "react"

export const IconButton = ({
  className,
  icon,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  icon: React.ReactNode
}) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive((prev) => !prev)
    onClick?.(e)
  }

  return (
    <button
      className={cn(
        className,
        "hover:text-blue-light-3 transition-colors-transform w-14 cursor-pointer duration-300",
        isActive && "rotate-180 transform",
      )}
      onClick={handleClick}
      {...props}
    >
      {icon}
    </button>
  )
}
