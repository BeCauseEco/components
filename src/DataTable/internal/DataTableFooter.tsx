import { DataTablePagination } from "./DataTablePagination"
import { DataTableHorizontalAffordance } from "./DataTableHorizontalAffordance"

interface PaginationProps {
  pageIndex: number
  pageSize: number
  totalCount: number
  totalPages: number
  pageSizeOptions?: number[]
  onPageChange: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

interface DataTableFooterProps {
  scrollContainer: HTMLElement | null
  pagination: PaginationProps | null
  textSize?: "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large"
}

export const DataTableFooter = (p: DataTableFooterProps) => {
  const showPagination = p.pagination !== null && p.pagination.totalPages > 1

  return (
    <>
      <DataTableHorizontalAffordance scrollContainer={p.scrollContainer} />

      {showPagination && (
        <DataTablePagination
          pageIndex={p.pagination!.pageIndex}
          pageSize={p.pagination!.pageSize}
          totalCount={p.pagination!.totalCount}
          pageSizeOptions={p.pagination!.pageSizeOptions}
          onPageChange={p.pagination!.onPageChange}
          onPageSizeChange={p.pagination!.onPageSizeChange}
          textSize={p.textSize}
        />
      )}
    </>
  )
}
