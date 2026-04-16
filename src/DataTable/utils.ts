import { DataType, Column } from "./types"
import { TABLE_CELL_EMPTY_STRING } from "./internal/constants"
import { format } from "date-fns"

export const createNewRow = <TData = any>(data: TData[]): object => {
  return { id: Math.max(...data.map((d: any) => d.id)) + 1 }
}

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

export const calculateColumnWidth = (
  column: Column,
): { minWidth: string | number; maxWidth: string | number; width: string | number } => {
  let minWidth: number | string = "auto"
  if (column.minWidth && typeof column.minWidth === "string") {
    minWidth = column.minWidth
  }

  let maxWidth: number | string = "auto"
  if (column.maxWidth && typeof column.maxWidth === "string") {
    maxWidth = column.maxWidth
  }

  let width: string | number = "auto"
  if (minWidth && maxWidth && minWidth === maxWidth) {
    width = minWidth //It is pretty obvious in this case, we want to fix the width of the column.
  } else if (column.explodeWidth) {
    width = "100%"
  }

  return { minWidth, maxWidth, width }
}
