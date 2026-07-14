import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { ScrollEdges, computeScrollEdges } from "./scrollEdges"

interface ScrollEdgeFadesProps {
  /** True when a pinned column occupies the left edge — its own gradient marks the scroll boundary, and the pinned content doesn't scroll. */
  suppressLeft: boolean
  /** True when the pinned actions column occupies the right edge (same reasoning). */
  suppressRight: boolean
  children: ReactNode
}

/**
 * Fades the content at a horizontally scrollable edge of ka-table's scroll
 * container while more columns exist beyond it. Scroll state lives here, in a
 * leaf component, so scrolling never re-renders the table itself.
 */
export const ScrollEdgeFades = ({ suppressLeft, suppressRight, children }: ScrollEdgeFadesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState<ScrollEdges>({ left: false, right: false, scrollbarHeight: 0 })

  const measure = useCallback(() => {
    const wrapper = containerRef.current?.querySelector<HTMLElement>(".ka-table-wrapper")
    if (!wrapper) {
      return
    }

    const next = computeScrollEdges(wrapper)
    setEdges(previous =>
      previous.left === next.left && previous.right === next.right && previous.scrollbarHeight === next.scrollbarHeight
        ? previous
        : next,
    )
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    measure()

    // Scroll events don't bubble but can be captured, so one listener here keeps
    // working even when ka-table remounts its scroll wrapper (editing-mode key change).
    container.addEventListener("scroll", measure, { capture: true, passive: true })

    // The container resizes with the viewport; the inner table resizes when data or
    // column widths change, which alters scrollWidth without resizing the container.
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    const table = container.querySelector(".ka-table-wrapper table")
    if (table) {
      resizeObserver.observe(table)
    }

    return () => {
      container.removeEventListener("scroll", measure, { capture: true })
      resizeObserver.disconnect()
    }
  }, [measure])

  return (
    <div ref={containerRef} style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%" }}>
      {children}
      {edges.left && !suppressLeft ? (
        <div className="scroll-edge-fade scroll-edge-fade-left" style={{ bottom: edges.scrollbarHeight }} />
      ) : null}
      {edges.right && !suppressRight ? (
        <div className="scroll-edge-fade scroll-edge-fade-right" style={{ bottom: edges.scrollbarHeight }} />
      ) : null}
    </div>
  )
}
