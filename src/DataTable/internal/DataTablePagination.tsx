import { useMemo } from "react"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Spacer } from "@new/Stack/Spacer"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { InputButtonTertiary } from "@new/InputButton/InputButtonTertiary"
import { InputCombobox } from "@new/InputCombobox/InputCombobox"
import { InputComboboxItem } from "@new/InputCombobox/InputComboboxItem"
import { Divider } from "@new/Divider/Divider"

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

  const textSizeProps = useMemo(() => {
    const size = p.textSize || "xsmall"
    return { [size]: true }
  }, [p.textSize])

  const pageNumbers = useMemo(() => buildPageNumbers(p.pageIndex, totalPages), [p.pageIndex, totalPages])

  const isFirstPage = p.pageIndex === 0
  const isLastPage = p.pageIndex >= totalPages - 1

  const showPageSizeSelector = p.onPageSizeChange && p.pageSizeOptions && p.pageSizeOptions.length > 0

  return (
    <Stack vertical hug>
      <Divider fill={[Color.Neutral, 100]} />

      <Spacer xsmall />

      <Align horizontal left>
        <Stack horizontal hug>
          {/* Left: item range */}
          <Align left horizontal hug>
            <Text fill={[Color.Neutral, 500]} {...textSizeProps}>
              {`Showing ${rangeStart}\u2013${rangeEnd} of ${p.totalCount}`}
            </Text>
          </Align>

          <Spacer large />

          {/* Center: page navigation */}
          <Align center horizontal hug>
            <InputButtonIconTertiary
              size="small"
              iconName="chevron_left"
              disabled={isFirstPage}
              onClick={() => p.onPageChange(p.pageIndex - 1)}
              title="Previous page"
            />

            <Spacer tiny />

            {pageNumbers.map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <Align key={`ellipsis-${index}`} center horizontal hug>
                    <Text fill={[Color.Neutral, 400]} {...textSizeProps}>
                      ...
                    </Text>

                    <Spacer tiny />
                  </Align>
                )
              }

              const isCurrent = page === p.pageIndex

              return (
                <Align key={String(page)} center horizontal hug>
                  <InputButtonTertiary
                    size="small"
                    width="auto"
                    label={String(page + 1)}
                    disabled={isCurrent}
                    onClick={() => p.onPageChange(page)}
                  />

                  <Spacer tiny />
                </Align>
              )
            })}

            <InputButtonIconTertiary
              size="small"
              iconName="chevron_right"
              disabled={isLastPage}
              onClick={() => p.onPageChange(p.pageIndex + 1)}
              title="Next page"
            />
          </Align>

          <Spacer large />

          {/* Right: page size selector */}
          {showPageSizeSelector ? (
            <Align right horizontal hug>
              <Text fill={[Color.Neutral, 500]} {...textSizeProps}>
                Rows per page:
              </Text>

              <Spacer small />

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
            </Align>
          ) : (
            <></>
          )}
        </Stack>
      </Align>

      <Spacer xsmall />
    </Stack>
  )
}
