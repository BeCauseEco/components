import { HorizontalOverflowApi } from "./useDataTableHorizontalOverflow"

interface DataTableEdgeFadeProps {
  overflow: HorizontalOverflowApi
}

export const DataTableEdgeFade = (p: DataTableEdgeFadeProps) => {
  if (!p.overflow.isOverflowing) {
    return null
  }

  return (
    <>
      {p.overflow.canScrollLeft && (
        <div
          className="datatable-edge-fade datatable-edge-fade-left"
          style={{ left: p.overflow.stickyLeftOffset }}
          aria-hidden="true"
        />
      )}
      {p.overflow.canScrollRight && (
        <div className="datatable-edge-fade datatable-edge-fade-right" aria-hidden="true" />
      )}
    </>
  )
}
