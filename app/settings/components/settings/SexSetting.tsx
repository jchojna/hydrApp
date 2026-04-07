"use client"

import { saveUserSettingAction } from "@/actions/settings"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/providers/SettingsContext"
import { Setting } from "../Setting"
import { USER_SEX_OPTIONS } from "@/lib/constants"

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
        <div className="text-right text-blue-200 capitalize">{nextValue}</div>
      )}
      renderEditor={({ value: draftValue, setValue, isSaving }) => (
        <Select value={draftValue} onValueChange={setValue} disabled={isSaving}>
          <SelectTrigger className="h-8 w-full rounded-full text-right capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {USER_SEX_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
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
