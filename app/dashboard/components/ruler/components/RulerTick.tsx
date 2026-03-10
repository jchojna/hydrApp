import { cn } from "@/lib/utils"
import {
  GLASS_VOLUME,
  RULER_TICK_HEIGHT,
  RULER_TICK_WIDTH,
} from "@/lib/constants"

type RulerTickProps = {
  index: number
  waterLevel: number
}

export const RulerTick = ({ index, waterLevel }: RulerTickProps) => {
  const isActive = waterLevel / GLASS_VOLUME === index

  return (
    <div className="relative z-10">
      <div
        className={cn(
          "bg-blue-light-1 rounded-r-[10px] transition-colors",
          isActive && "bg-blue-light-3",
        )}
        style={{
          height: `${RULER_TICK_HEIGHT}px`,
          width: `${RULER_TICK_WIDTH}px`,
        }}
      />
      <span
        className={cn(
          "text-blue-light-1 bg-blue-dark-1/20 absolute top-0 flex h-6 w-6 translate-y-[-40%] items-center justify-center rounded-full text-base transition-colors",
          isActive && "bg-blue-light-3 text-blue-dark-1 font-bold",
        )}
        style={{ left: `${RULER_TICK_WIDTH + 10}px` }}
      >
        {index}
      </span>
    </div>
  )
}
