import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"
import { Controls } from "../Controls"
import { EmojiIcon } from "@/components/EmojiIcon"
import { useSettings } from "@/providers/SettingsContext"
import { GlassContainer } from "@/components/GlassContainer"
import { BurgerCircleIcon } from "@/assets/svg/icons/burger-circle"
import { IconButton } from "@/components/IconButton"

type HeaderProps = {
  waterLevel: number
  onWaterLevelChange: (waterLevel: number) => void
  isSidebarOpen: boolean
  onSidebarOpenChange: (isOpen: boolean) => void
}

export const Header = ({
  waterLevel,
  onWaterLevelChange,
  isSidebarOpen,
  onSidebarOpenChange,
}: HeaderProps) => {
  const {
    settings: { maxWaterPerDay },
  } = useSettings()

  return (
    <GlassContainer
      className={cn(
        "flex h-auto w-full justify-between gap-4 rounded-[60px] bg-blue-500/20 p-3 pl-10 shadow-none",
        "transition-colors duration-300 hover:bg-blue-500/30",
        "lg:w-auto lg:justify-center lg:gap-10",
      )}
    >
      <Logo className="w-[120px]" />
      <div className="flex items-center gap-3">
        <Controls
          waterLevel={waterLevel}
          onWaterLevelChange={onWaterLevelChange}
        />
        <EmojiIcon waterLevel={waterLevel} maxWaterPerDay={maxWaterPerDay} />
        <IconButton
          icon={<BurgerCircleIcon />}
          className={cn(isSidebarOpen && "rotate-180 transform")}
          onClick={() => onSidebarOpenChange(!isSidebarOpen)}
        />
      </div>
    </GlassContainer>
  )
}
