import { useMemo, useState } from "react"

export default function usePagination<T>(
  items: T[],
  itemsPerPage: number,
  initialPage = 1,
) {
  const [page, setPage] = useState(initialPage)

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  const handleNextPage = () => {
    setPage((currentPage) => Math.min(currentPage + 1, totalPages))
  }

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1))
  }

  const disableNext = page >= totalPages
  const disablePrevious = page <= 1

  const paginatedItems = useMemo(() => {
    return items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  }, [items, itemsPerPage, page])

  return {
    page,
    totalPages,
    paginatedItems,
    setPage,
    handleNextPage,
    handlePreviousPage,
    disableNext,
    disablePrevious,
  }
}
