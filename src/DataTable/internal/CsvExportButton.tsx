import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { Column, DataTableExportConfig } from "../types"
import { buildCsv, buildCsvFilename, triggerCsvDownload } from "./exportToCsv"

export type CsvExportButtonProps = {
  config: DataTableExportConfig
  columns: Column[]
  data: any[]
}

export const CsvExportButton = ({ config, columns, data }: CsvExportButtonProps) => {
  const handleClick = () => {
    const csv = buildCsv(columns, data)
    const filename = buildCsvFilename(config.filename, config.appendTimestampToFilename ?? false)
    triggerCsvDownload(csv, filename)
  }

  return <InputButtonIconTertiary size="large" iconName="csv" onClick={handleClick} title="Export as CSV" />
}
