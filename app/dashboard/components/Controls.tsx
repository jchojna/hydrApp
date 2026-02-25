import { PlusCircleIcon } from "@/assets/svg/icons/plus-circle"
import { IconButton } from "@/components/IconButton"
import { MinusCircleIcon } from "@/assets/svg/icons/minus-circle"
import { waves } from "@/app/background"

import { Emoji1 } from "@/assets/svg/emojis/emoji-1"
// import { Emoji2 } from "@/assets/svg/emojis/emoji-2"
// import { Emoji3 } from "@/assets/svg/emojis/emoji-3"
// import { Emoji4 } from "@/assets/svg/emojis/emoji-4"
// import { Emoji5 } from "@/assets/svg/emojis/emoji-5"
// import { Emoji6 } from "@/assets/svg/emojis/emoji-6"
// import { Emoji7 } from "@/assets/svg/emojis/emoji-7"
// import { Emoji8 } from "@/assets/svg/emojis/emoji-8"

interface ControlsProps {
  waterLevel: number
  setWaterLevel: (waterLevel: number) => void
}

export const Controls = ({ waterLevel, setWaterLevel }: ControlsProps) => {
  const handleIncreaseWaterLevel = () => {
    setWaterLevel(waterLevel + 1)
    waves?.increaseWaterLevel()
  }

  const handleDecreaseWaterLevel = () => {
    setWaterLevel(waterLevel - 1)
    waves?.decreaseWaterLevel()
  }

  return (
    <div className="absolute right-0 bottom-0 flex flex-col gap-4 p-8">
      <IconButton
        icon={<PlusCircleIcon />}
        onClick={handleIncreaseWaterLevel}
      />
      <IconButton
        icon={<MinusCircleIcon />}
        onClick={handleDecreaseWaterLevel}
      />
      <Emoji1 className="w-14" />
      {/* <Emoji2 /> */}
      {/* <Emoji3 /> */}
      {/* <Emoji4 /> */}
      {/* <Emoji5 /> */}
      {/* <Emoji6 /> */}
      {/* <Emoji7 /> */}
      {/* <Emoji8 /> */}
    </div>
  )
}
