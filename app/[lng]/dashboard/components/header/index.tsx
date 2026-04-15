import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"
import { Controls } from "../Controls"
import { EmojiIcon } from "@/components/EmojiIcon"
import { useSettings } from "@/providers/SettingsContext"
import { GlassContainer } from "@/components/GlassContainer"

type HeaderProps = {
  waterLevel: number
  onWaterLevelChange: (waterLevel: number) => void
}

export const Header = ({ waterLevel, onWaterLevelChange }: HeaderProps) => {
  const {
    settings: { maxWaterPerDay },
  } = useSettings()

  return (
    <GlassContainer
      className={cn(
        "flex h-auto w-auto gap-6 rounded-xl bg-blue-200/20 px-8 py-5 shadow-none",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_16px_rgba(15,23,42,0.15)]",
        "backdrop-blur-xl",
      )}
    >
      <Controls
        waterLevel={waterLevel}
        onWaterLevelChange={onWaterLevelChange}
      />
      <Logo className="w-[120px]" />
      <EmojiIcon waterLevel={waterLevel} maxWaterPerDay={maxWaterPerDay} />
    </GlassContainer>
  )
}
