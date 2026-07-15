import { StyleFontFamily } from "@new/Text/Text"

let measurementContext: CanvasRenderingContext2D | null = null

/**
 * Measures the widest string in `texts` when rendered at `fontSizePx` with the standard Text font.
 * Returns 0 when nothing can be measured (empty input, SSR, or canvas unsupported).
 */
export const measureWidestTextPx = (texts: string[], fontSizePx: number): number => {
  if (texts.length === 0 || typeof document === "undefined") {
    return 0
  }

  if (!measurementContext) {
    measurementContext = document.createElement("canvas").getContext("2d")
  }

  const context = measurementContext
  if (!context) {
    return 0
  }

  // StyleFontFamily.fontFamily ends with a semicolon, which the canvas font parser rejects
  // (an invalid assignment silently keeps the previous font and skews every measurement).
  const fontFamily = StyleFontFamily.fontFamily.replace(";", "")
  context.font = `${StyleFontFamily.fontWeight} ${fontSizePx}px ${fontFamily}`

  return Math.ceil(Math.max(...texts.map(text => context.measureText(text).width)))
}

/**
 * Debounces a function call by the specified wait time.
 * @param func The function to debounce
 * @param waitFor The time to wait in milliseconds
 * @returns A debounced version of the function
 */
export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}

/**
 * Calculates the container width based on size and width props.
 * This matches the Container styled component's width calculation.
 * @param size The size variant ("small" | "large")
 * @param width The width variant ("fixed" | "auto")
 * @returns The calculated width as a CSS string
 */
export const calculateContainerWidth = (size: "small" | "large", width: "fixed" | "auto"): string => {
  if (width === "fixed") {
    return size === "small" ? "calc(var(--BU) * 70)" : "calc(var(--BU) * 80)"
  }
  return "auto"
}
