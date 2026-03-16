type StatsItemProps = {
  label: string
  mainValue: string
  secondaryValue?: string
}

export const StatsItem = ({
  label,
  mainValue,
  secondaryValue,
}: StatsItemProps) => {
  return (
    <div className="bg-blue-dark-3/60 flex items-center justify-between gap-3 rounded-xl px-4 py-3">
      <span className="text-blue-light-3 text-sm">{label}</span>
      <div className="text-right">
        <div className="text-blue-light-1 text-sm font-semibold">
          {mainValue}
        </div>
        {secondaryValue ? (
          <div className="text-blue-light-4 text-xs">{secondaryValue}</div>
        ) : null}
      </div>
    </div>
  )
}
