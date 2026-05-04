import { useCallback, useEffect, useRef } from "react"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { HorizontalOverflowApi } from "./useDataTableHorizontalOverflow"

interface DataTableHorizontalAffordanceProps {
  overflow: HorizontalOverflowApi
}

export const DataTableHorizontalAffordance = (p: DataTableHorizontalAffordanceProps) => {
  const proxyRef = useRef<HTMLDivElement>(null)
  const isSyncingRef = useRef(false)

  const writeScrollLeft = useCallback((target: HTMLElement | null, value: number) => {
    if (!target || target.scrollLeft === value || isSyncingRef.current) {
      return
    }
    isSyncingRef.current = true
    target.scrollLeft = value
    requestAnimationFrame(() => {
      isSyncingRef.current = false
    })
  }, [])

  useEffect(() => {
    writeScrollLeft(proxyRef.current, p.overflow.scrollLeft)
  }, [p.overflow.scrollLeft, writeScrollLeft])

  const handleProxyScroll = useCallback(() => {
    const proxy = proxyRef.current
    if (!proxy) {
      return
    }
    writeScrollLeft(p.overflow.scrollContainer, proxy.scrollLeft)
  }, [p.overflow.scrollContainer, writeScrollLeft])

  if (!p.overflow.isOverflowing) {
    return null
  }

  return (
    <div className="tw flex items-center gap-2 px-2 py-1">
      <InputButtonIconTertiary
        size="small"
        iconName="chevron_left"
        disabled={!p.overflow.canScrollLeft}
        onClick={() => p.overflow.scrollByColumn("left")}
        title="Scroll columns left"
      />

      <div ref={proxyRef} onScroll={handleProxyScroll} className="datatable-horizontal-scroll-proxy" aria-hidden="true">
        <div style={{ width: p.overflow.scrollWidth, height: 1 }} />
      </div>

      <InputButtonIconTertiary
        size="small"
        iconName="chevron_right"
        disabled={!p.overflow.canScrollRight}
        onClick={() => p.overflow.scrollByColumn("right")}
        title="Scroll columns right"
      />
    </div>
  )
}

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
