import { ReactNode, useEffect, useState, useTransition } from "react"

import { EditIcon } from "@/assets/svg/icons/edit"
import { ArrowBackIcon } from "@/assets/svg/icons/arrow-back"
import { SaveIcon } from "@/assets/svg/icons/save"
import { SidebarItemWrapper } from "@/components/SidebarItemWrapper"
import { Text } from "@/components/Text"
import { SidebarIconButton } from "@/components/SidebarIconButton"

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
    <SidebarItemWrapper as="li" isEditMode={isEditing} className="pr-1.5">
      <Text primary={label} className="min-w-0 flex-1 truncate" />
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
        <SidebarIconButton
          isVisible={isEditing}
          icon={<ArrowBackIcon />}
          onClick={handleCancel}
          disabled={isSaving}
        />
        <SidebarIconButton
          isVisible={isEditing}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={isSaving}
        />
        <SidebarIconButton
          icon={<EditIcon />}
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return
            setDraftValue(value)
            setIsEditing(true)
          }}
        />
      </div>
    </SidebarItemWrapper>
  )
}
