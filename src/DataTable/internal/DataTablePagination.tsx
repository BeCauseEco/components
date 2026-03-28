import { useMemo } from "react"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { InputButtonTertiary } from "@new/InputButton/InputButtonTertiary"
import { InputCombobox } from "@new/InputCombobox/InputCombobox"
import { InputComboboxItem } from "@new/InputCombobox/InputComboboxItem"
import { Color } from "@new/Color"

interface DataTablePaginationProps {
  pageIndex: number
  pageSize: number
  totalCount: number
  pageSizeOptions?: number[]
  onPageChange: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
  textSize?: "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large"
}

const buildPageNumbers = (pageIndex: number, totalPages: number): (number | "ellipsis")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const pages: (number | "ellipsis")[] = [0]

  if (pageIndex > 2) {
    pages.push("ellipsis")
  }

  const rangeStart = Math.max(1, pageIndex - 1)
  const rangeEnd = Math.min(totalPages - 2, pageIndex + 1)

  for (let i = rangeStart; i <= rangeEnd; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  if (pageIndex < totalPages - 3) {
    pages.push("ellipsis")
  }

  const lastPage = totalPages - 1
  if (!pages.includes(lastPage)) {
    pages.push(lastPage)
  }

  return pages
}

export const DataTablePagination = (p: DataTablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(p.totalCount / p.pageSize))
  const rangeStart = p.totalCount === 0 ? 0 : p.pageIndex * p.pageSize + 1
  const rangeEnd = Math.min((p.pageIndex + 1) * p.pageSize, p.totalCount)

  const pageNumbers = useMemo(() => buildPageNumbers(p.pageIndex, totalPages), [p.pageIndex, totalPages])

  const isFirstPage = p.pageIndex === 0
  const isLastPage = p.pageIndex >= totalPages - 1

  const showPageSizeSelector = p.onPageSizeChange && p.pageSizeOptions && p.pageSizeOptions.length > 0

  return (
    <div className="tw flex flex-col">
      <hr className="border-t border-[var(--color-neutral-100)] m-0" />

      <div className="flex items-center justify-end gap-6 px-4 py-2">
        <span className="text-xs text-[var(--color-neutral-500)] mr-auto">
          {`Showing ${rangeStart}\u2013${rangeEnd} of ${p.totalCount}`}
        </span>

        <div className="flex items-center gap-1">
          <InputButtonIconTertiary
            size="small"
            iconName="chevron_left"
            disabled={isFirstPage}
            onClick={() => p.onPageChange(p.pageIndex - 1)}
            title="Previous page"
          />

          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="text-xs text-[var(--color-neutral-400)] px-1">
                  ...
                </span>
              )
            }

            const isCurrent = page === p.pageIndex

            return (
              <InputButtonTertiary
                key={String(page)}
                size="small"
                width="auto"
                label={String(page + 1)}
                disabled={isCurrent}
                onClick={() => p.onPageChange(page)}
              />
            )
          })}

          <InputButtonIconTertiary
            size="small"
            iconName="chevron_right"
            disabled={isLastPage}
            onClick={() => p.onPageChange(p.pageIndex + 1)}
            title="Next page"
          />
        </div>

        {showPageSizeSelector ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-neutral-500)]">Rows per page:</span>

            <InputCombobox
              size="small"
              width="auto"
              color={Color.Neutral}
              textNoSelection={String(p.pageSize)}
              value={String(p.pageSize)}
              onChange={value => {
                const newPageSize = Number(value)
                if (!isNaN(newPageSize) && p.onPageSizeChange) {
                  p.onPageSizeChange(newPageSize)
                }
              }}
            >
              {p.pageSizeOptions!.map(option => (
                <InputComboboxItem key={option} value={String(option)} label={String(option)} />
              ))}
            </InputCombobox>
          </div>
        ) : null}
      </div>
    </div>
  )
}
