"use client"

import { ErrorMessage } from "@/components/ErrorMessage"
import { PaginationHeader } from "@/components/PaginationHeader"
import { SidebarSection } from "@/components/SidebarSection"
import usePagination from "@/hooks/usePagination"
import { RANKING_ITEMS_PER_PAGE } from "@/lib/constants"
import { RankingType } from "@/lib/utils/getRanking"

type RankingProps = {
  ranking: RankingType
  isLoading: boolean
  error: Error | null
}

// TODO: use isLoading to show loading state
export default function Ranking({ ranking, isLoading, error }: RankingProps) {
  const {
    page,
    totalPages,
    paginatedItems,
    handleNextPage,
    handlePreviousPage,
    disableNext,
    disablePrevious,
  } = usePagination(ranking, RANKING_ITEMS_PER_PAGE)

  return (
    <SidebarSection>
      <PaginationHeader
        title={`Ranking${totalPages > 1 ? ` (${page}/${totalPages})` : ""}`}
        onNextPage={totalPages > 1 ? handleNextPage : undefined}
        onPreviousPage={totalPages > 1 ? handlePreviousPage : undefined}
        isNextPageDisabled={disableNext}
        isPreviousPageDisabled={disablePrevious}
      />

      {error && <ErrorMessage message={error.message} />}

      <ol className="flex list-none flex-col gap-2">
        {paginatedItems.length ? (
          paginatedItems.map((item, index) => {
            const rank = (page - 1) * RANKING_ITEMS_PER_PAGE + index + 1

            return (
              <li
                key={item.userId}
                className="flex items-center justify-between gap-2 rounded-xl bg-blue-500/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-300/20 text-sm font-semibold text-blue-100">
                    {rank}
                  </span>
                  <span className="text-blue-100">{item.username}</span>
                </div>
                <div className="text-blue-300">{item.points} points</div>
              </li>
            )
          })
        ) : (
          <li>No ranking entries yet.</li>
        )}
      </ol>
    </SidebarSection>
  )
}
