import { DataType, Column } from "./types"
import { TABLE_CELL_EMPTY_STRING } from "./internal/constants"
import { format } from "date-fns"

/**
 * Formats a value according to its data type and optional formatting parameters.
 *
 * For DataType.Number columns, applies decimal formatting with the following precedence:
 * 1. Custom configure() function (if provided in column definition)
 * 2. decimalPlaces parameter (typically from defaultTrailingDecimals)
 * 3. Global default (2 decimal places)
 *
 * For DataType.Date columns, applies date formatting with the following precedence:
 * 1. Custom configure() function (if provided in column definition)
 * 2. dateFormat parameter (typically from defaultFormat)
 * 3. Global default (browser's locale date format)
 *
 * @param value - The raw value to format (as string)
 * @param dataType - The column data type determining formatting rules
 * @param placeholder - Optional placeholder for empty/null values
 * @param decimalPlaces - Number of decimal places for numeric values (0-20)
 * @param dateFormat - Custom date format string for DataType.Date columns (uses date-fns format)
 * @returns Formatted string ready for display
 *
 * @example
 * ```typescript
 * formatValue("123.456", DataType.Number, "", 2)                    // "123.46"
 * formatValue("123.456", DataType.Number, "", 0)                    // "123"
 * formatValue("", DataType.Number, "N/A", 2)                       // "N/A"
 * formatValue("2023-12-25", DataType.Date)                          // "12/25/2023" (locale-dependent)
 * formatValue("2023-12-25T14:30:00Z", DataType.Date, "", undefined, "yyyy-MM-dd HH:mm")  // "2023-12-25 14:30"
 * ```
 */
export const formatValue = (
  value: string,
  dataType: DataType,
  placeholder?: string,
  decimalPlaces?: number,
  dateFormat?: string,
): string => {
  const emptyString = placeholder || TABLE_CELL_EMPTY_STRING

  switch (dataType) {
    case DataType.Number:
      const decimals = Math.max(0, Math.floor(decimalPlaces ?? 2))
      return value
        ? new Intl.NumberFormat(undefined, {
            style: "decimal",
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(Number(value))
        : emptyString

    case DataType.Date:
      if (!value) {
        return emptyString
      }
      try {
        const date = new Date(value)
        if (dateFormat) {
          return format(date, dateFormat)
        }
        return date.toLocaleDateString()
      } catch {
        return value // Return original value if date parsing fails
      }

    case DataType.Boolean:
      return value ? (value === "true" ? "Yes" : "No") : emptyString

    case DataType.String:
      return value || emptyString

    default:
      return emptyString
  }
}

export const computeTotalPages = (totalCount: number, pageSize: number): number =>
  Math.max(1, Math.ceil(totalCount / pageSize))

/** Data types whose rendered content is inherently short (a status dot+label,
 *  "Yes"/"No", a formatted date, a number, an icon) and so should hug their
 *  content by default. Every other data type defaults to "grow". */
const FIT_BY_DEFAULT_DATA_TYPES: ReadonlySet<DataType> = new Set([
  DataType.Boolean,
  DataType.Date,
  DataType.Number,
  DataType.Status,
  DataType.Icon,
])

export type ResolvedColumnSizing = "fit" | "grow" | "fill" | "fixed"

/**
 * Resolves a column's effective sizing mode. Precedence (highest first):
 *   1. `minWidth === maxWidth` (both set) → "fixed" — an explicit exact width.
 *   2. explicit `column.sizing` → that value.
 *   3. `column.explodeWidth === true` → "fill" (deprecated alias).
 *   4. data-type default → "fit" for Boolean/Date/Number/Status/Icon, else "grow".
 */
export const resolveColumnSizing = (column: Column): ResolvedColumnSizing => {
  if (column.minWidth && column.maxWidth && column.minWidth === column.maxWidth) {
    return "fixed"
  }
  if (column.sizing) {
    return column.sizing
  }
  if (column.explodeWidth) {
    return "fill"
  }
  return FIT_BY_DEFAULT_DATA_TYPES.has(column.dataType) ? "fit" : "grow"
}

/**
 * Computes the inline width styles applied to BOTH header and body cells.
 * `width` comes from the resolved sizing mode; `minWidth`/`maxWidth` are always
 * emitted as clamps (default "auto"). See `resolveColumnSizing` for precedence.
 *
 *   fixed → width = the shared min/max value
 *   fit   → width = 1px (collapses to content; cell text is already `nowrap`)
 *   grow  → width = auto (shares leftover space)
 *   fill  → width = 100% (takes all leftover space)
 */
export const calculateColumnWidth = (
  column: Column,
): { minWidth: string | number; maxWidth: string | number; width: string | number } => {
  const minWidth: string | number = column.minWidth ?? "auto"
  const maxWidth: string | number = column.maxWidth ?? "auto"

  let width: string | number
  switch (resolveColumnSizing(column)) {
    case "fixed":
      width = minWidth // minWidth === maxWidth here
      break
    case "fit":
      width = "1px"
      break
    case "fill":
      width = "100%"
      break
    case "grow":
    default:
      width = "auto"
      break
  }

  return { minWidth, maxWidth, width }
}
