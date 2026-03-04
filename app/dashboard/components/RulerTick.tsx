import { cn } from "@/lib/utils"
import {
  GLASS_VOLUME,
  RULER_TICK_HEIGHT,
  RULER_TICK_WIDTH,
} from "../utils/constants"

type RulerTickProps = {
  index: number
  waterLevel: number
}

export const RulerTick = ({ index, waterLevel }: RulerTickProps) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "bg-blue-light-1 rounded-r-[10px]",
          waterLevel / GLASS_VOLUME === index && "bg-amber-600",
        )}
        style={{
          height: `${RULER_TICK_HEIGHT}px`,
          width: `${RULER_TICK_WIDTH}px`,
        }}
      />
      <span
        className="text-blue-light-1 absolute top-0 translate-y-[-40%] text-base"
        style={{ left: `${RULER_TICK_WIDTH + 10}px` }}
      >
        {index}
      </span>
    </div>
  )
}
