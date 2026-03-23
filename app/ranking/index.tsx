"use client"

import { PaginationHeader } from "@/components/PaginationHeader"
import usePagination from "@/hooks/usePagination"
import { RankingType } from "@/lib/utils/getRanking"

type RankingProps = {
  ranking: RankingType
  isLoading: boolean
  error: Error | null
}

// TODO: use isLoading to show loading state
export default function Ranking({ ranking, isLoading, error }: RankingProps) {
  const ITEMS_PER_PAGE = 3 // TODO: move to constants

  const {
    page,
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

      {error && <div className="text-red-300">Error: {error.message}</div>}

      <ol className="flex list-none flex-col gap-2">
        {paginatedItems.length ? (
          paginatedItems.map((item, index) => {
            const rank = (page - 1) * ITEMS_PER_PAGE + index + 1

            return (
            <li
              key={item.userId}
              className="bg-blue-dark-1/50 flex items-center justify-between gap-2 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <span className="bg-blue-300/20 text-blue-100 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                  {rank}
                </span>
                <span>{item.username}</span>
              </div>
              <div>{item.points} points</div>
            </li>
            )
          })
        ) : (
          <li>No ranking entries yet.</li>
        )}
      </ol>
    </div>
  )
}
