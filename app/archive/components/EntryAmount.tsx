type EntryAmountProps = {
  amount: number
  glassVolume: number
}

export const EntryAmount = ({ amount, glassVolume }: EntryAmountProps) => {
  const waterInGlasses = amount / glassVolume

  return (
    <div className="flex flex-col">
      <span className="text-blue-light-3 text-sm">{amount} L</span>
      <span className="text-blue-dark-5 text-xs">
        {waterInGlasses.toFixed(0)} glass{waterInGlasses === 1 ? "" : "es"}
      </span>
    </div>
  )
}
