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
      <div className="text-blue-light-3 text-4xl">{weekday}</div>
      <div className="text-blue-dark-3 text-2xl">{date}</div>
    </div>
  )
}
