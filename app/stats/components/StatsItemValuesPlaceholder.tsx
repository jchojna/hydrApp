import { Skeleton } from "@/components/ui/skeleton"

export const StatsItemValuesPlaceholder = () => {
  return (
    <div className="flex flex-col items-end justify-between gap-2">
      <Skeleton className="bg-blue-light-1/50 h-4 w-12 rounded-full" />
      <Skeleton className="bg-blue-dark-1/50 h-3 w-20 rounded-full" />
    </div>
  )
}
