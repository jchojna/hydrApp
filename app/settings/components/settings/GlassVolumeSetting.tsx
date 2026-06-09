"use client"

import { saveUserSettingAction } from "@/actions/settings"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/providers/SettingsContext"
import { clamp } from "@/lib/utils/clamp"
import { Setting } from "../Setting"
import { formatLitres } from "../../../../lib/utils/formatLitres"
import { MAX_GLASS_VOLUME } from "@/lib/constants"
import { Text } from "@/components/Text"

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
        <Text primary={formatLitres(nextValue)} className="text-right" />
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-right text-xs text-blue-200">
            {formatLitres(draftValue)}
          </span>
          <Slider
            min={0}
            max={MAX_GLASS_VOLUME}
            step={0.05}
            value={[draftValue]}
            disabled={isSaving}
            onValueChange={(nextValues) => {
              if (!nextValues.length) return

              setValue(clamp(nextValues[0], 0, MAX_GLASS_VOLUME))
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
