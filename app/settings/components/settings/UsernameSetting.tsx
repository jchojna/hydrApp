"use client"

import { saveUserSettingAction } from "@/actions/settings"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/providers/SettingsContext"
import { Setting } from "../Setting"

export const UsernameSetting = () => {
  const {
    settings: { username },
    setSettings,
  } = useSettings()

  return (
    <Setting
      label="Username"
      value={username}
      renderValue={(nextValue) => (
        <div className="truncate text-right text-blue-200">{nextValue}</div>
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <Input
          value={draftValue}
          className="h-8"
          disabled={isSaving}
          onChange={(event) => setValue(event.target.value)}
        />
      )}
      onSave={async (nextValue) => {
        const response = await saveUserSettingAction({
          key: "username",
          value: nextValue,
        })

        if (!response.success) return false
        setSettings(response.data)

        return true
      }}
    />
  )
}
