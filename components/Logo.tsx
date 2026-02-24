import { LOGO } from "@/app/background/utils/logo"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn(
        "relative z-20 flex items-center justify-center",
        className,
      )}
    >
      <svg className="text-blue-light-1 w-full" viewBox="0 0 512 135">
        <path d={LOGO.partA.path} fill="currentColor" />
      </svg>
      <svg
        className="text-blue-light-3 absolute h-full w-full"
        viewBox="0 0 512 135"
      >
        <path d={LOGO.partB.path} fill="currentColor" />
      </svg>
    </div>
  )
}
