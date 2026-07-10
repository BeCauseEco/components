import { utils, writeFile } from "xlsx"
import { Column } from "../types"
import { buildTimestampedFilename, formatCellForCsv, getDisplayableColumns } from "./exportToCsv"

/** A cell becomes a real number only when the formatted text survives a lossless
 *  round-trip; everything else stays text. Keeps leading-zero values ("0653") and
 *  identifiers beyond Excel's 15-digit float precision intact, while freeing decimal
 *  values (coordinates) from locale-dependent CSV parsing. */
const toCellValue = (text: string): string | number =>
  text !== "" && String(Number(text)) === text ? Number(text) : text

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
  utils.book_append_sheet(workbook, worksheet)
  writeFile(workbook, filename)
}
