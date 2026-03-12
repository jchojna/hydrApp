import { GLASS_VOLUME } from "@/lib/constants"

type EntryAmountProps = {
  amount: number
}

export const EntryAmount = ({ amount }: EntryAmountProps) => {
  const waterInGlasses = amount / GLASS_VOLUME

  return (
    <div className="flex flex-col">
      <span className="text-blue-light-3 text-sm">{amount} L</span>
      <span className="text-blue-dark-5 text-xs">
        {waterInGlasses.toFixed(0)} glass{waterInGlasses === 1 ? "" : "es"}
      </span>
    </div>
  )
}
