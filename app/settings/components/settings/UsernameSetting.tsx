"use client"

import { saveUserSettingAction } from "@/actions/settings"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/providers/SettingsContext"
import { Setting } from "../Setting"
import { Text } from "@/components/Text"

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
        <Text
          primary={nextValue}
          className="animate-in fade-in text-right duration-300"
        />
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <Input
          value={draftValue}
          className="animate-in fade-in h-8 min-h-8 w-full border-none bg-blue-500/50 duration-300"
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
