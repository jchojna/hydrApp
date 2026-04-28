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
  const normalizedAverage = Math.max(0, Math.min(averageWaterLevel / maxWaterPerDay, 1))
  const markerTopRatio = 1 - normalizedAverage

  const averageMarkerTopOffset = `calc(${markerTopRatio * 100}% - ${markerTopRatio * RULER_TICK_HEIGHT}px)`

  return (
    <div
      className="pointer-events-none absolute left-0 z-9 flex items-center justify-end rounded-r-full bg-blue-500/40 pr-3 pl-12 transition-[top] duration-300"
      style={{ top: averageMarkerTopOffset, height: `${RULER_TICK_HEIGHT}px` }}
    >
      <span className="text-xs font-bold text-nowrap text-blue-100 uppercase">
        Avg {avgInGlasses} ({averageWaterLevel.toFixed(2)} L)
      </span>
    </div>
  )
}
