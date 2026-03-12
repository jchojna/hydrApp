import { useEffect, useState, useTransition } from "react"

import { EmojiIcon } from "@/components/EmojiIcon"
import { GLASS_VOLUME, MAX_WATER_PER_DAY } from "@/lib/constants"
import { ArchiveEntry } from "@/lib/types"
import { EditIcon } from "@/assets/svg/icons/edit"
import { IconButton } from "@/components/IconButton"
import { ArrowDownIcon } from "@/assets/svg/icons/arrow-down"
import { ArrowUpIcon } from "@/assets/svg/icons/arrow-up"
import { ArrowBackIcon } from "@/assets/svg/icons/arrow-back"
import { SaveIcon } from "@/assets/svg/icons/save"
import { cn } from "@/lib/utils"
import { saveConsumptionAction } from "@/actions/consumption"
import { EntryDate } from "./EntryDate"
import { EntryAmount } from "./EntryAmount"
import { clampWaterLevel } from "@/app/dashboard/utils/clampWaterLevel"

type EntryProps = {
  entry: ArchiveEntry
}

export const Entry = ({ entry }: EntryProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const waterLevelFromDb = Number(entry.amount)
  const [isSaving, startSaveTransition] = useTransition()
  const [editedWaterLevel, setEditedWaterLevel] = useState(waterLevelFromDb)

  useEffect(() => {
    setEditedWaterLevel(waterLevelFromDb)
  }, [waterLevelFromDb])

  const handleDecreaseWaterLevel = () => {
    setEditedWaterLevel((currentValue) =>
      clampWaterLevel(currentValue - GLASS_VOLUME),
    )
  }

  const handleIncreaseWaterLevel = () => {
    setEditedWaterLevel((currentValue) =>
      clampWaterLevel(currentValue + GLASS_VOLUME),
    )
  }

  const handleCancelEditing = () => {
    setEditedWaterLevel(waterLevelFromDb)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (editedWaterLevel === waterLevelFromDb) {
      setIsEditing(false)
      return
    }

    startSaveTransition(async () => {
      const response = await saveConsumptionAction({
        amount: editedWaterLevel,
        date: entry.date,
      })

      if (!response.success) return // TODO: show error message

      setIsEditing(false)
    })
  }

  return (
    <div
      key={entry.date}
      className={cn(
        "text-blue-light-1 bg-blue-dark-2 flex items-center gap-2 rounded-full px-3 py-1",
        isEditing && "bg-blue-dark-1",
      )}
    >
      <EntryDate date={entry.date} />
      <EntryAmount amount={editedWaterLevel} />
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <IconButton
              className="h-6 w-6"
              icon={<ArrowDownIcon />}
              onClick={handleDecreaseWaterLevel}
              disabled={isSaving || editedWaterLevel <= 0}
            />
            <IconButton
              className="h-6 w-6"
              icon={<ArrowUpIcon />}
              onClick={handleIncreaseWaterLevel}
              disabled={isSaving || editedWaterLevel >= MAX_WATER_PER_DAY}
            />
            <IconButton
              className="h-6 w-6"
              icon={<ArrowBackIcon />}
              onClick={handleCancelEditing}
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
            className="h-6 w-6"
            icon={<EditIcon />}
            onClick={() => {
              setEditedWaterLevel(waterLevelFromDb)
              setIsEditing(true)
            }}
          />
        )}
      </div>
      <EmojiIcon
        className="w-6"
        waterLevel={editedWaterLevel}
        maxWaterPerDay={MAX_WATER_PER_DAY}
      />
    </div>
  )
}
