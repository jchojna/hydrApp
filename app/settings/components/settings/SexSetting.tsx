"use client"

import { saveUserSettingAction } from "@/actions/settings"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/contexts/SettingsContext"
import { Setting } from "../Setting"

export const SexSetting = () => {
  const {
    settings: { sex },
    setSettings,
  } = useSettings()

  return (
    <Setting
      label="Sex"
      value={sex}
      renderValue={(nextValue) => (
        <div className="text-blue-light-2 text-right capitalize">{nextValue}</div>
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <Select value={draftValue} onValueChange={setValue} disabled={isSaving}>
          <SelectTrigger className="h-8 w-full rounded-full text-right capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      )}
      onSave={async (nextValue) => {
        const response = await saveUserSettingAction({
          key: "sex",
          value: nextValue,
        })

        if (!response.success) return false
        setSettings(response.data)

        return true
      }}
    />
  )
}
