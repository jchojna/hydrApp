import { cn } from "@/lib/utils"
import { RULER_TICK_HEIGHT, RULER_TICK_WIDTH } from "@/lib/constants"

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
      <div
        className={cn(
          "rounded-r-[10px] bg-blue-300 transition-colors",
          isActive && "bg-blue-100",
        )}
        style={{
          height: `${RULER_TICK_HEIGHT}px`,
          width: `${RULER_TICK_WIDTH}px`,
        }}
      />
      <span
        className={cn(
          "absolute top-0 flex h-6 w-6 translate-y-[-40%] items-center justify-center rounded-full bg-blue-500/20 text-base text-blue-300 transition-colors",
          isActive && "bg-blue-100 font-bold text-blue-500",
        )}
        style={{ left: `${RULER_TICK_WIDTH + 10}px` }}
      >
        {index}
      </span>
    </div>
  )
}
