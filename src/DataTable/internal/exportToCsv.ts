import { Column, DataType } from "../types"

/** Returns the column subset whose values are user-perceivable text — used both
 *  for CSV export and for narrowing the search index. Internal columns hold action
 *  affordances (no data); Object columns hold raw structures with no display form. */
export const getDisplayableColumns = (columns: Column[]): Column[] =>
  columns.filter(c => c.dataType !== DataType.Internal && c.dataType !== DataType.Object)

/** UTC date-only or datetime detector for incoming `DataType.Date` values.
 *  Returns true if the value should be rendered as `yyyy-MM-dd` (no time component
 *  was meaningfully provided). */
const isDateOnlyValue = (value: unknown): boolean => {
  if (typeof value !== "string") {
    return false
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return true
  }
  // ISO with explicit zero UTC time, e.g. "2026-04-28T00:00:00Z" or "2026-04-28T00:00:00.000Z".
  // The trailing Z is required — strings without it are local-time and may not represent
  // midnight UTC, so we let them fall through to the datetime formatter.
  if (/^\d{4}-\d{2}-\d{2}T00:00:00(\.\d+)?Z$/.test(value)) {
    return true
  }
  return false
}

const padTwo = (n: number): string => (n < 10 ? `0${n}` : `${n}`)

/** Formats a Date as `yyyy-MM-dd HH:mm:ssZ` in UTC. Built by hand to keep the
 *  literal `Z` correct (date-fns/format would apply local timezone). */
const formatUtcDateTime = (date: Date): string => {
  const yyyy = date.getUTCFullYear()
  const MM = padTwo(date.getUTCMonth() + 1)
  const dd = padTwo(date.getUTCDate())
  const HH = padTwo(date.getUTCHours())
  const mm = padTwo(date.getUTCMinutes())
  const ss = padTwo(date.getUTCSeconds())
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}Z`
}

/** Formats a Date (or date-string) as `yyyy-MM-dd` in UTC. */
const formatUtcDate = (date: Date): string => {
  const yyyy = date.getUTCFullYear()
  const MM = padTwo(date.getUTCMonth() + 1)
  const dd = padTwo(date.getUTCDate())
  return `${yyyy}-${MM}-${dd}`
}

/** Formats one row's cell for the column. See spec §"Per-cell formatting precedence". */
export const formatCellForCsv = (column: Column, row: any): string => {
  const value: unknown = row[column.key]
  switch (column.dataType) {
    case DataType.Status: {
      const configured = column.status?.configure(row)
      if (configured?.label !== undefined) {
        return configured.label
      }
      return value == null ? "" : String(value)
    }

    case DataType.Date: {
      if (value == null || value === "") {
        return ""
      }
      if (column.dateFormat?.configure) {
        return column.dateFormat.configure(value as string | Date, row)
      }
      const dateOnly = isDateOnlyValue(value)
      const date = value instanceof Date ? value : new Date(value as string)
      if (isNaN(date.getTime())) {
        return String(value)
      }
      return dateOnly ? formatUtcDate(date) : formatUtcDateTime(date)
    }

    case DataType.Number: {
      if (value == null || value === "") {
        return ""
      }
      if (column.numberFormat?.configure) {
        return column.numberFormat.configure(Number(value), row)
      }
      return String(value)
    }

    case DataType.Boolean: {
      if (value === true) {
        return "Yes"
      }
      if (value === false) {
        return "No"
      }
      return ""
    }

    case DataType.ProgressIndicator: {
      const configured = column.progressIndicator?.configure(row)
      return configured?.value !== undefined ? String(configured.value) : ""
    }

    case DataType.Icon: {
      return ""
    }

    case DataType.String:
    default: {
      if (value == null) {
        return ""
      }
      return String(value)
    }
  }
}

/** RFC 4180 field quoting. */
const escapeCsvField = (field: string): string => {
  if (/[",\r\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

/** Builds a full CSV string from columns and rows. UTF-8 BOM prefix included. */
export const buildCsv = (columns: Column[], rows: any[]): string => {
  const displayable = getDisplayableColumns(columns)
  const headerLine = displayable.map(c => escapeCsvField(c.title)).join(",")
  const dataLines = rows.map(row => displayable.map(column => escapeCsvField(formatCellForCsv(column, row))).join(","))
  const BOM = "﻿"
  return BOM + [headerLine, ...dataLines].join("\r\n")
}

/** Builds the filename: `<filename>.csv` or `<filename> <yyyyMMddHHmmss>.csv` (timestamp in UTC). */
export const buildCsvFilename = (filenameBase: string, appendTimestamp: boolean, now: Date = new Date()): string => {
  if (!appendTimestamp) {
    return `${filenameBase}.csv`
  }
  const yyyy = now.getUTCFullYear()
  const MM = padTwo(now.getUTCMonth() + 1)
  const dd = padTwo(now.getUTCDate())
  const HH = padTwo(now.getUTCHours())
  const mm = padTwo(now.getUTCMinutes())
  const ss = padTwo(now.getUTCSeconds())
  const timestamp = `${yyyy}${MM}${dd}${HH}${mm}${ss}`
  return `${filenameBase} ${timestamp}.csv`
}

/** Triggers a browser download of the given CSV string. */
export const triggerCsvDownload = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Defer the revoke until after the browser has begun reading the Blob —
  // synchronous revoke can race the download in Safari/Firefox.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
