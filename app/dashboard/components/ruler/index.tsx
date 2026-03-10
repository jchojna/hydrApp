import {
  GLASS_VOLUME,
  MAX_WATER_PER_DAY,
  RULER_TICK_HEIGHT,
} from "@/lib/constants"
import { AvgTick } from "./components/AvgTick"
import { RulerTick } from "./components/RulerTick"

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

  return (
    <div
      className="absolute top-[20%] left-0 flex flex-col-reverse justify-between"
      style={{
        top: getRulerOffset(topOffset),
        bottom: getRulerOffset(bottomOffset),
      }}
    >
      <AvgTick averageWaterLevel={averageWaterLevel} />
      {Array.from({ length: ticks }).map((_, index) => (
        <RulerTick key={index} index={index} waterLevel={waterLevel} />
      ))}
    </div>
  )
}
