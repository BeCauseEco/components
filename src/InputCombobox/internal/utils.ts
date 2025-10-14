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
