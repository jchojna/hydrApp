import { StatsItemValuesPlaceholder } from "./StatsItemValuesPlaceholder"

type StatsItemProps = {
  label: string
  mainValue: string
  secondaryValue?: string
  isLoading?: boolean
}

export const StatsItem = ({
  label,
  mainValue,
  secondaryValue,
  isLoading,
}: StatsItemProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-blue-300/30 px-4 py-3">
      <span className="text-sm text-blue-100">{label}</span>
      {isLoading ? (
        <StatsItemValuesPlaceholder />
      ) : (
        <div className="text-right">
          <div className="text-sm font-semibold text-blue-300">{mainValue}</div>
          {secondaryValue ? (
            <div className="text-blue-light-4 text-xs">{secondaryValue}</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
