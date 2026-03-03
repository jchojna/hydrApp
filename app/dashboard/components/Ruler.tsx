import { cn } from "@/lib/utils"
import { GLASS_VOLUME, MAX_WATER_PER_DAY } from "../utils/constants"

type RulerProps = {
  waterLevel: number
  topOffset?: number
  bottomOffset?: number
}

const TICK_HEIGHT = 6
const TICK_WIDTH = 15

const getRulerOffset = (offset: number) => {
  return `calc(${offset * 100}% - ${TICK_HEIGHT / 2}px)`
}

type RulerTickProps = {
  index: number
  waterLevel: number
}

const RulerTick = ({ index, waterLevel }: RulerTickProps) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "bg-blue-light-1 rounded-r-[10px]",
          waterLevel / GLASS_VOLUME === index && "bg-amber-600",
        )}
        style={{ height: `${TICK_HEIGHT}px`, width: `${TICK_WIDTH}px` }}
      />
      <span
        className="text-blue-light-1 absolute top-0 translate-y-[-40%] text-base"
        style={{ left: `${TICK_WIDTH + 10}px` }}
      >
        {index}
      </span>
    </div>
  )
}

export const Ruler = ({
  waterLevel,
  topOffset = 0.05,
  bottomOffset = 0.1,
}: RulerProps) => {
  const ticks = MAX_WATER_PER_DAY / GLASS_VOLUME + 1

  return (
    <div
      className="absolute top-[20%] left-0 flex flex-col-reverse justify-between"
      style={{
        top: getRulerOffset(topOffset),
        bottom: getRulerOffset(bottomOffset),
      }}
    >
      {Array.from({ length: ticks }).map((_, index) => (
        <RulerTick key={index} index={index} waterLevel={waterLevel} />
      ))}
    </div>
  )
}
