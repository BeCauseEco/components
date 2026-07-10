import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { Column, DataTableExportConfig } from "../types"
import { buildXlsxData, buildXlsxFilename, triggerXlsxDownload } from "./exportToXlsx"

export type ExportButtonProps = {
  config: DataTableExportConfig
  columns: Column[]
  data: any[]
  selectionActive?: boolean
  selectionCount?: number
}

export const ExportButton = ({
  config,
  columns,
  data,
  selectionActive = false,
  selectionCount = 0,
}: ExportButtonProps) => {
  const handleClick = () => {
    const sheetData = buildXlsxData(columns, data)
    const filename = buildXlsxFilename(config.filename, config.appendTimestampToFilename ?? false)
    triggerXlsxDownload(sheetData, filename)
    config.onExport?.()
  }

  const title =
    selectionActive && selectionCount > 0 ? `Export selected (${selectionCount}) as Excel` : "Export as Excel"

  return <InputButtonIconTertiary size="large" iconName="download" onClick={handleClick} title={title} />
}
