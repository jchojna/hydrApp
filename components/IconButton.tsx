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
        "transition-colors-transform w-10 cursor-pointer text-blue-200 duration-300 hover:text-blue-100",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-blue-300",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {icon}
    </button>
  )
}
