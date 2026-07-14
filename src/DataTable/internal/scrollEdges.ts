/** Absorbs subpixel scroll positions so a fade never lingers at a fully scrolled edge. */
const SCROLL_EDGE_THRESHOLD_PX = 2

/** Subset of HTMLElement scroll metrics, so the math is exercisable without a DOM. */
export interface ScrollEdgeMetrics {
  scrollLeft: number
  scrollWidth: number
  clientWidth: number
  offsetHeight: number
  clientHeight: number
}

export interface ScrollEdges {
  left: boolean
  right: boolean
  /** Height of the horizontal scrollbar; fades stop above it so the scrollbar stays visible. */
  scrollbarHeight: number
}

/** Which edges of a horizontally scrollable container have more content beyond them. */
export const computeScrollEdges = (metrics: ScrollEdgeMetrics): ScrollEdges => ({
  left: metrics.scrollLeft > SCROLL_EDGE_THRESHOLD_PX,
  right: metrics.scrollWidth - metrics.clientWidth - metrics.scrollLeft > SCROLL_EDGE_THRESHOLD_PX,
  scrollbarHeight: metrics.offsetHeight - metrics.clientHeight,
})
