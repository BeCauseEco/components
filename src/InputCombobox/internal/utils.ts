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
