import { ProgressIndicator } from "@new/ProgressIndicator/ProgressIndicator"
import { ProgressIndicatorSegment } from "@new/ProgressIndicator/ProgressIndicatorSegment"
import { Badge } from "@new/Badge/Badge"
import { Icon } from "@new/Icon/Icon"
import { Color } from "@new/Color"
import { ICellTextProps, ICellEditorProps } from "ka-table/props"
import { Column } from "../types"
import { TABLE_CELL_EMPTY_STRING } from "@new/DataTable/internal/constants"

type CellRendererProps = (ICellTextProps | ICellEditorProps) & {
  textSize?: "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large"
}

export const CellProgressIndicator = (cellTextProps: CellRendererProps) => {
  const progressIndicator = cellTextProps.column["progressIndicator"] as Column["progressIndicator"]
  const { value, color } = progressIndicator?.configure(cellTextProps.rowData) || { value: 0, color: Color.Neutral }
  const startAdornment = cellTextProps.column["startAdornment"] as Column["startAdornment"]
  const endAdornment = cellTextProps.column["endAdornment"] as Column["endAdornment"]

  return (
    <ProgressIndicator
      type="bar"
      size="small"
      color={Color.Neutral}
      labelStart={typeof startAdornment === "function" ? (startAdornment(cellTextProps.rowData) as any) : undefined}
      labelEnd={typeof endAdornment === "function" ? (endAdornment(cellTextProps.rowData) as any) : undefined}
    >
      <ProgressIndicatorSegment width={`${value}%`} color={color} label={`${value}%`} />
    </ProgressIndicator>
  )
}

export const CellStatus = (cellTextProps: CellRendererProps) => {
  const status = cellTextProps.column["status"] as Column["status"]
  const configured = status?.configure(cellTextProps.rowData)

  if (!configured?.color || !configured.label) {
    return <span className="font-mono text-sm text-neutral-700">{TABLE_CELL_EMPTY_STRING}</span>
  }

  return (
    <Badge
      size="large"
      variant="transparent"
      color={configured.color}
      iconName="circle"
      label={configured.label}
      pulse={configured.pulse}
    />
  )
}

export const CellIcon = (cellTextProps: CellRendererProps) => {
  const column = cellTextProps.column as Column
  const iconConfig = column.icon?.configure(cellTextProps.rowData)

  return iconConfig ? <Icon name={iconConfig.name} fill={iconConfig.color} medium /> : null
}
