import { cn } from "@/lib/utils"
import { IconButton } from "./IconButton"

export const SidebarIconButton = ({
  className,
  isVisible = true,
  ...props
}: React.ComponentProps<typeof IconButton> & { isVisible?: boolean }) => {
  return (
    <IconButton
      className={cn(
        "h-8 w-0 text-blue-200 opacity-0 hover:text-blue-100",
        isVisible && "w-8 opacity-100",
        className,
      )}
      {...props}
    />
  )
}
