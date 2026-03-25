"use client"

import { saveUserSettingAction } from "@/actions/settings"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/contexts/SettingsContext"
import { clamp } from "@/lib/utils/clamp"
import { Setting } from "../Setting"
import { formatLitres } from "../../../../lib/utils/formatLitres"

export const GlassVolumeSetting = () => {
  const {
    settings: { glassVolume },
    setSettings,
  } = useSettings()

  return (
    <Setting
      label="Glass Volume"
      value={glassVolume}
      isDisabled
      renderValue={(nextValue) => (
        <div className="text-blue-light-2 text-right">
          {formatLitres(nextValue)}
        </div>
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-blue-light-2 text-right text-xs">
            {formatLitres(draftValue)}
          </span>
          <Slider
            min={0}
            max={2}
            step={0.05}
            value={[draftValue]}
            disabled={isSaving}
            onValueChange={(nextValues) => {
              if (!nextValues.length) return

              setValue(clamp(nextValues[0], 0, 2))
            }}
          />
        </div>
      )}
      onSave={async (nextValue) => {
        const response = await saveUserSettingAction({
          key: "glassVolume",
          value: nextValue,
        })

        if (!response.success) return false
        setSettings(response.data)

        return true
      }}
    />
  )
}
