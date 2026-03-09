import {
  GLASS_VOLUME,
  MAX_WATER_PER_DAY,
  RULER_TICK_HEIGHT,
} from "../utils/constants"
import { RulerTick } from "./RulerTick"

type RulerProps = {
  waterLevel: number
  averageWaterLevel: number | null
  topOffset?: number
  bottomOffset?: number
}

const getRulerOffset = (offset: number) => {
  return `calc(${offset * 100}% - ${RULER_TICK_HEIGHT / 2}px)`
}

export const Ruler = ({
  waterLevel,
  averageWaterLevel,
  topOffset = 0.05,
  bottomOffset = 0.1,
}: RulerProps) => {
  const ticks = MAX_WATER_PER_DAY / GLASS_VOLUME + 1
  const clampedAverageWaterLevel =
    averageWaterLevel === null
      ? null
      : Math.min(Math.max(averageWaterLevel, 0), MAX_WATER_PER_DAY)
  const averageMarkerTop =
    clampedAverageWaterLevel === null
      ? null
      : `calc(${(1 - clampedAverageWaterLevel / MAX_WATER_PER_DAY) * 100}% - ${
          RULER_TICK_HEIGHT / 2
        }px)`

  return (
    <div
      className="absolute top-[20%] left-0 flex flex-col-reverse justify-between"
      style={{
        top: getRulerOffset(topOffset),
        bottom: getRulerOffset(bottomOffset),
      }}
    >
      {averageMarkerTop && (
        <div
          className="pointer-events-none absolute left-0 z-10"
          style={{ top: averageMarkerTop }}
        >
          <div
            className="bg-blue-light-3 rounded-r-[10px]"
            style={{ height: `${RULER_TICK_HEIGHT}px`, width: "50px" }}
          />
          <span className="text-blue-light-3 absolute top-1/2 left-[55px] z-0 -translate-y-1/2 text-xs font-bold uppercase">
            avg {clampedAverageWaterLevel}
          </span>
        </div>
      )}
      {Array.from({ length: ticks }).map((_, index) => (
        <RulerTick key={index} index={index} waterLevel={waterLevel} />
      ))}
    </div>
  )
}
