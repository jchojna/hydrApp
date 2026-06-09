"use client"

import { saveUserSettingAction } from "@/actions/settings"
import { useSettings } from "@/providers/SettingsContext"
import { NumberEditor } from "../NumberEditor"
import { Setting } from "../Setting"
import { formatLitres } from "../../../../lib/utils/formatLitres"
import { MAX_WATER_LIMIT } from "@/lib/constants"
import { Text } from "@/components/Text"

export const MaxWaterPerDaySetting = () => {
  const {
    settings: { maxWaterPerDay },
    setSettings,
  } = useSettings()

  return (
    <Setting
      label="Max Water / Day"
      value={maxWaterPerDay}
      isDisabled
      renderValue={(nextValue) => (
        <Text primary={formatLitres(nextValue)} className="text-right" />
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <NumberEditor
          value={draftValue}
          onChange={setValue}
          min={0}
          max={MAX_WATER_LIMIT}
          step={0.25}
          isSaving={isSaving}
        />
      )}
      onSave={async (nextValue) => {
        const response = await saveUserSettingAction({
          key: "maxWaterPerDay",
          value: nextValue,
        })

        if (!response.success) return false
        setSettings(response.data)

        return true
      }}
    />
  )
}
