import { cn } from "@/lib/utils"

export const IconButton = ({
  className,
  icon,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  icon: React.ReactNode
}) => {
  return (
    <button
      className={cn(
        className,
        "text-blue-light-1 hover:text-blue-light-3 transition-colors-transform w-14 cursor-pointer duration-300",
      )}
      onClick={onClick}
      {...props}
    >
      {icon}
    </button>
  )
}
