import { RULER_TICK_HEIGHT } from "@/lib/constants"

type AvgTickProps = {
  averageWaterLevel: number | null
  glassVolume: number
  maxWaterPerDay: number
}

export const AvgTick = ({
  averageWaterLevel,
  glassVolume,
  maxWaterPerDay,
}: AvgTickProps) => {
  if (averageWaterLevel === null) return null

  const avgInGlasses = (averageWaterLevel / glassVolume).toFixed(1)

  const averageMarkerTopOffset = `calc(${(1 - averageWaterLevel / maxWaterPerDay) * 100}% - ${
    RULER_TICK_HEIGHT / 2
  }px)`

  return (
    <div
      className="pointer-events-none absolute left-0 z-10 transition-[top] duration-300"
      style={{ top: averageMarkerTopOffset }}
    >
      <div
        className="bg-blue-dark-2 rounded-r-[10px]"
        style={{ height: `${RULER_TICK_HEIGHT}px`, width: "50px" }}
      />
      <span className="text-blue-light-3 absolute top-1/2 left-[55px] z-0 -translate-y-1/2 text-xs font-bold text-nowrap uppercase">
        Avg {avgInGlasses} ({averageWaterLevel.toFixed(2)} L)
      </span>
    </div>
  )
}
