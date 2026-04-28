import { RULER_TICK_HEIGHT } from "@/lib/constants"
import { cn } from "@/lib/utils"

type RulerTickProps = {
  index: number
  waterLevel: number
  glassVolume: number
}

export const RulerTick = ({
  index,
  waterLevel,
  glassVolume,
}: RulerTickProps) => {
  const isActive = Math.floor(waterLevel / glassVolume) === index

  return (
    <div className="relative z-10">
      <span
        className={cn(
          "flex w-10 items-center justify-end rounded-r-full bg-blue-500/40 pr-3 text-base text-blue-200 transition-colors",
          isActive && "bg-blue-100 font-bold text-blue-600",
        )}
        style={{ height: `${RULER_TICK_HEIGHT}px` }}
      >
        {index}
      </span>
    </div>
  )
}
