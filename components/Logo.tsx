import { LOGO } from "@/app/background/utils/logo"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <a
      href="https://github.com/jchojna/hydrApp"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative z-20 flex cursor-pointer items-center justify-center",
        className,
      )}
    >
      <svg className="w-full text-blue-700" viewBox="0 0 512 135">
        <path d={LOGO.partA.path} fill="currentColor" />
      </svg>
      <svg
        className="absolute h-full w-full text-blue-500"
        viewBox="0 0 512 135"
      >
        <path d={LOGO.partB.path} fill="currentColor" />
      </svg>
    </a>
  )
}
