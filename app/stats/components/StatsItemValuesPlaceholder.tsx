import { Skeleton } from "@/components/ui/skeleton"

export const StatsItemValuesPlaceholder = () => {
  return (
    <div className="flex flex-col items-end justify-between gap-2">
      <Skeleton className="h-4 w-12 rounded-full bg-blue-300/50" />
      <Skeleton className="h-3 w-20 rounded-full bg-blue-500/50" />
    </div>
  )
}
