// TODO: revalidate periodically to catch change after midnight
export const Today = () => {
  const today = new Date()
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" })
  const date = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col items-center gap-1 font-bold">
      <div className="text-4xl text-blue-100/80">{weekday}</div>
      <div className="text-2xl font-medium text-blue-50">{date}</div>
    </div>
  )
}
