import { DataType, Column, DataTableProps } from "./types"
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
      if (!value) return emptyString
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

export const csv = <TData = any>(data: TData[], columns: Column[]) => {
  const dataSanitized: any[][] = [columns.map(c => c.title)]

  data.forEach(row => {
    const rowSanitized: string[] = []

    columns.forEach(c => {
      const column = c as Column
      const value = (row[column.key] || "").toString()
      const emptyString = column.placeholder || TABLE_CELL_EMPTY_STRING

      if (column.dataType === DataType.Boolean) {
        rowSanitized.push(value !== undefined ? (value ? "Yes" : "No") : emptyString)
      } else if (column.dataType === DataType.String) {
        const stringValue = value || emptyString
        rowSanitized.push(stringValue.lastIndexOf(";") !== -1 ? `"${stringValue}"` : stringValue)
      } else if (column.dataType === DataType.ProgressIndicator) {
        rowSanitized.push(row[column.key]?.["value"] || emptyString)
      } else {
        rowSanitized.push(value || emptyString)
      }
    })

    dataSanitized.push(rowSanitized)
  })

  if (window) {
    window.open("data:text/csv;charset=utf-8," + dataSanitized.map(ds => ds.join(";")).join("\n"))
  }
}
