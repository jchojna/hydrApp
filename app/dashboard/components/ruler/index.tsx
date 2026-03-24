import { RULER_TICK_HEIGHT } from "@/lib/constants"
import { AvgTick } from "./components/AvgTick"
import { RulerTick } from "./components/RulerTick"

type RulerProps = {
  waterLevel: number
  averageWaterLevel: number
  glassVolume: number
  maxWaterPerDay: number
  topOffset?: number
  bottomOffset?: number
}

const getRulerOffset = (offset: number) => {
  return `calc(${offset * 100}% - ${RULER_TICK_HEIGHT / 2}px)`
}

export const Ruler = ({
  waterLevel,
  averageWaterLevel,
  glassVolume,
  maxWaterPerDay,
  topOffset = 0.05,
  bottomOffset = 0.1,
}: RulerProps) => {
  const ticks = Math.floor(maxWaterPerDay / glassVolume) + 1

  return (
    <div
      className="absolute top-[20%] left-0 flex flex-col-reverse justify-between"
      style={{
        top: getRulerOffset(topOffset),
        bottom: getRulerOffset(bottomOffset),
      }}
    >
      <AvgTick
        averageWaterLevel={averageWaterLevel}
        glassVolume={glassVolume}
        maxWaterPerDay={maxWaterPerDay}
      />
      {Array.from({ length: ticks }).map((_, index) => (
        <RulerTick
          key={index}
          index={index}
          waterLevel={waterLevel}
          glassVolume={glassVolume}
        />
      ))}
    </div>
  )
}
