import {
  GLASS_VOLUME,
  MAX_WATER_PER_DAY,
  RULER_TICK_HEIGHT,
} from "@/lib/constants"

type AvgTickProps = {
  averageWaterLevel: number | null
}

export const AvgTick = ({ averageWaterLevel }: AvgTickProps) => {
  if (averageWaterLevel === null) return null

  const avgInGlasses = (averageWaterLevel / GLASS_VOLUME).toFixed(1)

  const averageMarkerTopOffset = `calc(${(1 - averageWaterLevel / MAX_WATER_PER_DAY) * 100}% - ${
    RULER_TICK_HEIGHT / 2
  }px)`

  return (
    <div
      className="pointer-events-none absolute left-0 z-10"
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
