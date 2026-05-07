import { StatsItemValuesPlaceholder } from "./StatsItemValuesPlaceholder"
import { Text } from "@/components/Text"

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
      <Text primary={label} />
      {isLoading ? (
        <StatsItemValuesPlaceholder />
      ) : (
        <Text
          primary={mainValue}
          secondary={secondaryValue}
          className="text-right"
        />
      )}
    </div>
  )
}
