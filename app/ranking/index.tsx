"use client"

import { PaginationHeader } from "@/components/PaginationHeader"
import usePagination from "@/hooks/usePagination"
import { RankingType } from "@/lib/utils/getRanking"

type RankingProps = {
  ranking: RankingType
  isLoading: boolean
  error: Error | null
}

export default function Ranking({ ranking, isLoading, error }: RankingProps) {
  const ITEMS_PER_PAGE = 3

  const {
    totalPages,
    paginatedItems,
    handleNextPage,
    handlePreviousPage,
    disableNext,
    disablePrevious,
  } = usePagination(ranking, ITEMS_PER_PAGE)

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4">
      <PaginationHeader
        title="Ranking"
        onNextPage={totalPages > 1 ? handleNextPage : undefined}
        onPreviousPage={totalPages > 1 ? handlePreviousPage : undefined}
        isNextPageDisabled={disableNext}
        isPreviousPageDisabled={disablePrevious}
      />
      {error && <div className="text-red-200">Error: {error.message}</div>}
      <div className="flex flex-col gap-2">
        {paginatedItems.length ? (
          paginatedItems.map((item) => (
            <div
              key={item.userId}
              className="bg-blue-dark-1/50 flex items-center justify-between gap-2 rounded-xl p-4"
            >
              <div>{item.userId}</div>
              <div>{item.points} points</div>
            </div>
          ))
        ) : (
          <span>No ranking entries yet.</span>
        )}
      </div>
    </div>
  )
}
