import { ArrowDownIcon } from "@/assets/svg/icons/arrow-down"
import { ArrowUpIcon } from "@/assets/svg/icons/arrow-up"
import { IconButton } from "@/components/IconButton"
import { Input } from "@/components/ui/input"
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
      <Input
        type="number"
        className="h-8 w-20 text-right"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={isSaving}
        onChange={(event) => {
          const parsedValue = Number(event.target.value)
          if (Number.isNaN(parsedValue)) return

          onChange(clamp(parsedValue, min, max))
        }}
      />
      <IconButton
        className="h-6 w-6"
        icon={<ArrowDownIcon />}
        onClick={() => onChange(clamp(value - step, min, max))}
        disabled={isSaving || value <= min}
      />
      <IconButton
        className="h-6 w-6"
        icon={<ArrowUpIcon />}
        onClick={() => onChange(clamp(value + step, min, max))}
        disabled={isSaving || value >= max}
      />
    </div>
  )
}
