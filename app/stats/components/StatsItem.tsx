import { StatsItemValuesPlaceholder } from "./StatsItemValuesPlaceholder"
import { SidebarItemWrapper } from "@/components/SidebarItemWrapper"
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
    <SidebarItemWrapper>
      <Text primary={label} className="flex-1" />
      {isLoading ? (
        <StatsItemValuesPlaceholder />
      ) : (
        <Text
          primary={mainValue}
          secondary={secondaryValue}
          className="text-right"
        />
      )}
    </SidebarItemWrapper>
  )
}
