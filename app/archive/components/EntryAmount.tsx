type EntryAmountProps = {
  amount: number
  glassVolume: number
}

export const EntryAmount = ({ amount, glassVolume }: EntryAmountProps) => {
  const waterInGlasses = amount / glassVolume

  return (
    <div className="flex w-14 flex-col">
      <span className="text-sm text-blue-100">{amount} L</span>
      <span className="text-xs text-blue-900">
        {/* TODO: use i18n pluralization */}
        {waterInGlasses.toFixed(0)} glass{waterInGlasses === 1 ? "" : "es"}
      </span>
    </div>
  )
}
