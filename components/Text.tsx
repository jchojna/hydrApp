import { cn } from "@/lib/utils"

type BaseTextProps = {
  className?: string
}

type TextProps =
  | (BaseTextProps & {
      primary: string
      secondary?: string
    })
  | (BaseTextProps & {
      primary?: string
      secondary: string
    })

export const Text = ({ primary, secondary, className }: TextProps) => {
  return (
    <div className={cn("flex min-w-16 flex-col", className)}>
      <span className="text-sm text-blue-100">{primary}</span>
      <span className="text-xs font-medium text-blue-200">{secondary}</span>
    </div>
  )
}
