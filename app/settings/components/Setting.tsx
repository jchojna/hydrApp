import { ReactNode, useEffect, useState, useTransition } from "react"

import { EditIcon } from "@/assets/svg/icons/edit"
import { ArrowBackIcon } from "@/assets/svg/icons/arrow-back"
import { SaveIcon } from "@/assets/svg/icons/save"
import { IconButton } from "@/components/IconButton"
import { cn } from "@/lib/utils"

type SettingProps<T> = {
  label: string
  value: T
  isDisabled?: boolean
  renderValue: (value: T) => ReactNode
  renderEditor: (params: {
    value: T
    setValue: (value: T) => void
    isSaving: boolean
  }) => ReactNode
  onSave: (value: T) => Promise<boolean>
}

export const Setting = <T,>({
  label,
  value,
  isDisabled,
  renderValue,
  renderEditor,
  onSave,
}: SettingProps<T>) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draftValue, setDraftValue] = useState(value)
  const [isSaving, startSaveTransition] = useTransition()

  useEffect(() => {
    setDraftValue(value)
  }, [value])

  const handleCancel = () => {
    setDraftValue(value)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (draftValue === value) {
      setIsEditing(false)
      return
    }

    startSaveTransition(async () => {
      const success = await onSave(draftValue)
      if (!success) return

      setIsEditing(false)
    })
  }

  return (
    <li
      className={cn(
        "text-blue-light-1 bg-blue-dark-1/50 flex items-center gap-2 rounded-full px-3 py-1",
        isEditing && "bg-blue-dark-1",
      )}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <div className="min-w-0 flex-1">
        {isEditing
          ? renderEditor({
              value: draftValue,
              setValue: setDraftValue,
              isSaving,
            })
          : renderValue(value)}
      </div>
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <IconButton
              className="h-6 w-6"
              icon={<ArrowBackIcon />}
              onClick={handleCancel}
              disabled={isSaving}
            />
            <IconButton
              className="h-6 w-6"
              icon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaving}
            />
          </>
        ) : (
          <IconButton
            className={cn(
              "h-6 w-6",
              isDisabled &&
                "hover:text-blue-light-1 cursor-not-allowed opacity-50",
            )}
            icon={<EditIcon />}
            onClick={() => {
              if (isDisabled) return
              setDraftValue(value)
              setIsEditing(true)
            }}
          />
        )}
      </div>
    </li>
  )
}
