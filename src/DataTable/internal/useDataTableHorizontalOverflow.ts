import { useEffect, useState } from "react"

export interface HorizontalOverflowState {
  isOverflowing: boolean
  scrollLeft: number
  scrollWidth: number
  clientWidth: number
  stickyLeftOffset: number
}

export interface HorizontalOverflowApi extends HorizontalOverflowState {
  canScrollLeft: boolean
  canScrollRight: boolean
}

const EDGE_TOLERANCE_PX = 1

const INITIAL_STATE: HorizontalOverflowState = {
  isOverflowing: false,
  scrollLeft: 0,
  scrollWidth: 0,
  clientWidth: 0,
  stickyLeftOffset: 0,
}

const readState = (element: HTMLElement): HorizontalOverflowState => {
  const { scrollLeft, scrollWidth, clientWidth } = element
  let stickyLeftOffset = 0
  const headers = element.querySelectorAll<HTMLTableCellElement>("thead th")
  headers.forEach(th => {
    if (window.getComputedStyle(th).position === "sticky") {
      stickyLeftOffset += th.offsetWidth
    }
  })
  return {
    isOverflowing: scrollWidth - clientWidth > EDGE_TOLERANCE_PX,
    scrollLeft,
    scrollWidth,
    clientWidth,
    stickyLeftOffset,
  }
}

const stateEquals = (a: HorizontalOverflowState, b: HorizontalOverflowState): boolean =>
  a.isOverflowing === b.isOverflowing &&
  a.scrollLeft === b.scrollLeft &&
  a.scrollWidth === b.scrollWidth &&
  a.clientWidth === b.clientWidth &&
  a.stickyLeftOffset === b.stickyLeftOffset

export const useDataTableHorizontalOverflow = (scrollContainer: HTMLElement | null): HorizontalOverflowApi => {
  const [state, setState] = useState<HorizontalOverflowState>(INITIAL_STATE)

  useEffect(() => {
    if (!scrollContainer) {
      let frame = 0
      frame = requestAnimationFrame(() => {
        setState(prev => (stateEquals(prev, INITIAL_STATE) ? prev : INITIAL_STATE))
      })
      return () => cancelAnimationFrame(frame)
    }

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const next = readState(scrollContainer)
        setState(prev => (stateEquals(prev, next) ? prev : next))
      })
    }

    update()

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(scrollContainer)
    const innerTable = scrollContainer.querySelector("table")
    if (innerTable) {
      resizeObserver.observe(innerTable)
    }

    scrollContainer.addEventListener("scroll", update, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      scrollContainer.removeEventListener("scroll", update)
    }
  }, [scrollContainer])

  const canScrollLeft = state.scrollLeft > EDGE_TOLERANCE_PX
  const canScrollRight = state.scrollWidth - state.clientWidth - state.scrollLeft > EDGE_TOLERANCE_PX

  return {
    ...state,
    canScrollLeft,
    canScrollRight,
  }
}
