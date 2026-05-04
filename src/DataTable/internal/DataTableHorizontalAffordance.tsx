import { useCallback, useEffect, useRef, useState } from "react"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { useDataTableHorizontalOverflow } from "./useDataTableHorizontalOverflow"

interface DataTableHorizontalAffordanceProps {
  scrollContainer: HTMLElement | null
}

export const DataTableHorizontalAffordance = (p: DataTableHorizontalAffordanceProps) => {
  const overflow = useDataTableHorizontalOverflow(p.scrollContainer)
  const proxyRef = useRef<HTMLDivElement>(null)
  const isSyncingRef = useRef(false)

  // Keep the proxy's scrollLeft in sync with the table.
  useEffect(() => {
    const proxy = proxyRef.current
    if (!proxy) {
      return
    }
    if (isSyncingRef.current) {
      return
    }
    isSyncingRef.current = true
    proxy.scrollLeft = overflow.scrollLeft
    requestAnimationFrame(() => {
      isSyncingRef.current = false
    })
  }, [overflow.scrollLeft])

  const handleProxyScroll = useCallback(() => {
    if (isSyncingRef.current) {
      return
    }
    if (!proxyRef.current || !p.scrollContainer) {
      return
    }
    isSyncingRef.current = true
    p.scrollContainer.scrollLeft = proxyRef.current.scrollLeft
    requestAnimationFrame(() => {
      isSyncingRef.current = false
    })
  }, [p.scrollContainer])

  if (!overflow.isOverflowing) {
    return null
  }

  return (
    <div className="tw flex items-center gap-2 px-2 py-1">
      <InputButtonIconTertiary
        size="small"
        iconName="chevron_left"
        disabled={!overflow.canScrollLeft}
        onClick={() => overflow.scrollByColumn("left")}
        title="Scroll columns left"
      />

      <div ref={proxyRef} onScroll={handleProxyScroll} className="datatable-horizontal-scroll-proxy" aria-hidden="true">
        <div style={{ width: overflow.scrollWidth, height: 1 }} />
      </div>

      <InputButtonIconTertiary
        size="small"
        iconName="chevron_right"
        disabled={!overflow.canScrollRight}
        onClick={() => overflow.scrollByColumn("right")}
        title="Scroll columns right"
      />
    </div>
  )
}

interface DataTableEdgeFadeProps {
  scrollContainer: HTMLElement | null
}

export const DataTableEdgeFade = (p: DataTableEdgeFadeProps) => {
  const overflow = useDataTableHorizontalOverflow(p.scrollContainer)
  const [stickyOffset, setStickyOffset] = useState(0)

  useEffect(() => {
    if (!p.scrollContainer) {
      return
    }
    const updateSticky = () => {
      if (!p.scrollContainer) {
        return
      }
      let offset = 0
      const headers = p.scrollContainer.querySelectorAll<HTMLTableCellElement>("thead th")
      headers.forEach(th => {
        const position = window.getComputedStyle(th).position
        if (position === "sticky") {
          offset += th.offsetWidth
        }
      })
      setStickyOffset(offset)
    }
    updateSticky()
    const observer = new ResizeObserver(updateSticky)
    observer.observe(p.scrollContainer)
    return () => observer.disconnect()
  }, [p.scrollContainer])

  if (!overflow.isOverflowing) {
    return null
  }

  return (
    <>
      {overflow.canScrollLeft && (
        <div
          className="datatable-edge-fade datatable-edge-fade-left"
          style={{ left: stickyOffset }}
          aria-hidden="true"
        />
      )}
      {overflow.canScrollRight && <div className="datatable-edge-fade datatable-edge-fade-right" aria-hidden="true" />}
    </>
  )
}
