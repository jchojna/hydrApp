"use client"

import { saveUserSettingAction } from "@/actions/settings"
import { useSettings } from "@/providers/SettingsContext"
import { NumberEditor } from "../NumberEditor"
import { Setting } from "../Setting"
import { MAX_USER_AGE } from "@/lib/constants"
import { Text } from "@/components/Text"

export const AgeSetting = () => {
  const {
    settings: { age },
    setSettings,
  } = useSettings()

  return (
    <Setting
      label="Age"
      value={age}
      renderValue={(nextValue) => (
        <Text primary={nextValue} className="text-right" />
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <NumberEditor
          value={draftValue}
          onChange={setValue}
          min={0}
          max={MAX_USER_AGE}
          step={1}
          isSaving={isSaving}
        />
      )}
      onSave={async (nextValue) => {
        const response = await saveUserSettingAction({
          key: "age",
          value: nextValue,
        })

        if (!response.success) return false
        setSettings(response.data)

        return true
      }}
    />
  )
}
