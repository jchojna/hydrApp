import { EmojiIcon } from "@/components/EmojiIcon"
import { GLASS_VOLUME, MAX_WATER_PER_DAY } from "@/lib/constants"
import { ArchiveEntry } from "@/lib/types"

type EntryProps = {
  entry: ArchiveEntry
}

export const Entry = ({ entry }: EntryProps) => {
  const waterLevel = Number(entry.amount)
  const waterInGlasses = waterLevel / GLASS_VOLUME

  return (
    <div key={entry.date} className="text-blue-light-1 flex items-center gap-2">
      <span className="flex-1">{entry.date}</span>
      <span className="text-nowrap">
        {entry.amount} L ({waterInGlasses.toFixed(0)} glasses)
      </span>
      <EmojiIcon
        className="w-6"
        waterLevel={waterLevel}
        maxWaterPerDay={MAX_WATER_PER_DAY}
      />
    </div>
  )
}
