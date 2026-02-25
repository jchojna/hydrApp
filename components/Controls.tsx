import { PlusCircleIcon } from "@/assets/svg/icons/plus-circle"
import { IconButton } from "./IconButton"
import { MinusCircleIcon } from "@/assets/svg/icons/minus-circle"
import { waves } from "@/app/background"

export const Controls = () => {
  return (
    <div className="absolute right-0 bottom-0 flex flex-col gap-4 p-8">
      <IconButton
        icon={<PlusCircleIcon />}
        onClick={() => waves?.increaseWaterLevel()}
      />
      <IconButton
        icon={<MinusCircleIcon />}
        onClick={() => waves?.decreaseWaterLevel()}
      />
    </div>
  )
}
