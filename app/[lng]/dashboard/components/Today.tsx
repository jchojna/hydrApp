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
    <div className="flex flex-col items-center gap-2 font-bold">
      <div className="text-4xl text-blue-100">{weekday}</div>
      <div className="text-2xl text-blue-700">{date}</div>
    </div>
  )
}
