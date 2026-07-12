import { utils, writeFile } from "xlsx"
import { Column } from "../types"
import { buildTimestampedFilename, formatCellForCsv, getDisplayableColumns } from "./exportToCsv"

/** Excel stores numbers as doubles but only displays 15 significant digits — longer
 *  identifiers would render in scientific notation, silently corrupted. */
const EXCEL_MAX_SIGNIFICANT_DIGITS = 15

/** A cell becomes a real number only when the formatted text survives a lossless
 *  round-trip AND fits Excel's precision; everything else stays text. Keeps
 *  leading-zero values ("0653"), identifier-length digit strings, and literal
 *  "Infinity"/"NaN" intact, while freeing decimal values (coordinates) from
 *  locale-dependent CSV parsing. The round-trip alone is not enough: 16–19-digit
 *  integers below 2^53 (and exact powers of ten beyond) round-trip cleanly in JS
 *  but exceed what Excel can display faithfully. */
const toCellValue = (text: string): string | number => {
  if (text === "") {
    return text
  }
  const value = Number(text)
  if (!Number.isFinite(value) || String(value) !== text) {
    return text
  }
  const significantDigits = text.replace(/[-.]/g, "").replace(/^0+/, "").length
  return significantDigits <= EXCEL_MAX_SIGNIFICANT_DIGITS ? value : text
}

/** Builds the worksheet contents (header row + one row per data row) with the same
 *  column semantics as buildCsv: displayable columns only, csvExpand fan-out,
 *  formatCellForCsv per cell. */
export const buildXlsxData = (columns: Column[], rows: any[]): (string | number)[][] => {
  const displayable = getDisplayableColumns(columns)

  const header: (string | number)[] = displayable.flatMap(c => {
    if (c.csvExpand) {
      return rows.length > 0 ? c.csvExpand(rows[0]).map(e => e.title) : [c.title]
    }
    return [c.title]
  })

  const dataRows = rows.map(row =>
    displayable.flatMap(c => {
      if (c.csvExpand) {
        return c.csvExpand(row).map(e => toCellValue(e.value))
      }
      return [toCellValue(formatCellForCsv(c, row))]
    }),
  )

  return [header, ...dataRows]
}

/** Builds the filename: `<filename>.xlsx` or `<filename> <yyyyMMddHHmmss>.xlsx` (timestamp in UTC). */
export const buildXlsxFilename = (filenameBase: string, appendTimestamp: boolean, now: Date = new Date()): string =>
  buildTimestampedFilename(filenameBase, "xlsx", appendTimestamp, now)

/** Triggers a browser download of the given worksheet data as a single-sheet .xlsx workbook. */
export const triggerXlsxDownload = (data: (string | number)[][], filename: string): void => {
  const worksheet = utils.aoa_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Sheet1")
  writeFile(workbook, filename)
}
