import { useCallback, useEffect, useState } from "react"

export interface HorizontalOverflowState {
  isOverflowing: boolean
  scrollLeft: number
  scrollWidth: number
  clientWidth: number
  canScrollLeft: boolean
  canScrollRight: boolean
}

export interface HorizontalOverflowApi extends HorizontalOverflowState {
  scrollByColumn: (direction: "left" | "right") => void
  scrollToOffset: (offset: number) => void
}

const EDGE_TOLERANCE_PX = 1

const readState = (element: HTMLElement): HorizontalOverflowState => {
  const { scrollLeft, scrollWidth, clientWidth } = element
  return {
    isOverflowing: scrollWidth - clientWidth > EDGE_TOLERANCE_PX,
    scrollLeft,
    scrollWidth,
    clientWidth,
    canScrollLeft: scrollLeft > EDGE_TOLERANCE_PX,
    canScrollRight: scrollWidth - clientWidth - scrollLeft > EDGE_TOLERANCE_PX,
  }
}

const findColumnTargets = (scrollContainer: HTMLElement): number[] => {
  const containerRect = scrollContainer.getBoundingClientRect()
  const headers = scrollContainer.querySelectorAll<HTMLTableCellElement>("thead th")
  const offsets: number[] = []
  headers.forEach(th => {
    if (window.getComputedStyle(th).position === "sticky") {
      return
    }
    const rect = th.getBoundingClientRect()
    const offset = rect.left - containerRect.left + scrollContainer.scrollLeft
    if (Number.isFinite(offset)) {
      offsets.push(offset)
    }
  })
  return Array.from(new Set(offsets)).sort((a, b) => a - b)
}

export const useDataTableHorizontalOverflow = (scrollContainer: HTMLElement | null): HorizontalOverflowApi => {
  const [state, setState] = useState<HorizontalOverflowState>({
    isOverflowing: false,
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
    canScrollLeft: false,
    canScrollRight: false,
  })

  useEffect(() => {
    if (!scrollContainer) {
      return
    }

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setState(readState(scrollContainer))
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

  const scrollToOffset = useCallback(
    (offset: number) => {
      if (!scrollContainer) {
        return
      }
      const max = scrollContainer.scrollWidth - scrollContainer.clientWidth
      const clamped = Math.max(0, Math.min(max, offset))
      scrollContainer.scrollTo({ left: clamped, behavior: "smooth" })
    },
    [scrollContainer],
  )

  const scrollByColumn = useCallback(
    (direction: "left" | "right") => {
      if (!scrollContainer) {
        return
      }
      const targets = findColumnTargets(scrollContainer)
      const current = scrollContainer.scrollLeft
      let target: number | undefined
      if (direction === "right") {
        target = targets.find(left => left > current + EDGE_TOLERANCE_PX)
      } else {
        for (let i = targets.length - 1; i >= 0; i--) {
          if (targets[i] < current - EDGE_TOLERANCE_PX) {
            target = targets[i]
            break
          }
        }
      }

      if (target === undefined) {
        // Fallback: scroll by 80% of viewport width
        const delta = scrollContainer.clientWidth * 0.8
        scrollToOffset(direction === "right" ? current + delta : current - delta)
        return
      }

      scrollToOffset(target)
    },
    [scrollContainer, scrollToOffset],
  )

  return {
    ...state,
    scrollByColumn,
    scrollToOffset,
  }
}
