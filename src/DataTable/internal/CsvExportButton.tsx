import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { Column, DataTableExportConfig } from "../types"
import { buildCsv, buildCsvFilename, triggerCsvDownload } from "./exportToCsv"

export type CsvExportButtonProps = {
  config: DataTableExportConfig
  columns: Column[]
  data: any[]
  selectionActive?: boolean
  selectionCount?: number
}

export const CsvExportButton = ({
  config,
  columns,
  data,
  selectionActive = false,
  selectionCount = 0,
}: CsvExportButtonProps) => {
  const handleClick = () => {
    const csv = buildCsv(columns, data)
    const filename = buildCsvFilename(config.filename, config.appendTimestampToFilename ?? false)
    triggerCsvDownload(csv, filename)
    config.onExport?.()
  }

  const title = selectionActive && selectionCount > 0 ? `Export selected (${selectionCount}) as CSV` : "Export as CSV"

  return <InputButtonIconTertiary size="large" iconName="csv" onClick={handleClick} title={title} />
}
