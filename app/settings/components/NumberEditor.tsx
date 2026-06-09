import { ArrowDownIcon } from "@/assets/svg/icons/arrow-down"
import { ArrowUpIcon } from "@/assets/svg/icons/arrow-up"
import { SidebarIconButton } from "@/components/SidebarIconButton"
import { Text } from "@/components/Text"
import { clamp } from "@/lib/utils/clamp"

export const NumberEditor = ({
  value,
  onChange,
  min,
  max,
  step,
  isSaving,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  isSaving: boolean
}) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Text primary={value} className="mr-3 min-w-0" />
      <SidebarIconButton
        icon={<ArrowDownIcon />}
        onClick={() => onChange(clamp(value - step, min, max))}
        disabled={isSaving || value <= min}
      />
      <SidebarIconButton
        icon={<ArrowUpIcon />}
        onClick={() => onChange(clamp(value + step, min, max))}
        disabled={isSaving || value >= max}
      />
    </div>
  )
}
