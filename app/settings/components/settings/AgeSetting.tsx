"use client"

import { saveUserSettingAction } from "@/actions/settings"
import { useSettings } from "@/contexts/SettingsContext"
import { NumberEditor } from "../NumberEditor"
import { Setting } from "../Setting"

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
        <div className="text-blue-light-2 text-right">{nextValue}</div>
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <NumberEditor
          value={draftValue}
          onChange={setValue}
          min={0}
          max={130}
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
