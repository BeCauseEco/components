import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { ProgressIndicator } from "@new/ProgressIndicator/ProgressIndicator"
import { ProgressIndicatorSegment } from "@new/ProgressIndicator/ProgressIndicatorSegment"
import { Badge } from "@new/Badge/Badge"
import { Text } from "@new/Text/Text"
import { Icon } from "@new/Icon/Icon"
import { Color } from "@new/Color"
import { ICellTextProps, ICellEditorProps } from "ka-table/props"
import { Column } from "../types"
import { TABLE_CELL_EMPTY_STRING } from "@new/DataTable/internal/constants"

export const CellProgressIndicator = (cellTextProps: ICellTextProps | ICellEditorProps) => {
  const progressIndicator = cellTextProps.column["progressIndicator"] as Column["progressIndicator"]
  const type = progressIndicator?.type || "bar"
  const { value, color } = progressIndicator?.configure(cellTextProps.rowData) || { value: 0, color: Color.Neutral }

  return (
    <Stack hug horizontal>
      <Align horizontal left={type === "bar"} center={type === "circle"}>
        <ProgressIndicator
          type={type}
          size="large"
          color={Color.Neutral}
          labelStart={
            typeof cellTextProps.column["startAdornment"] === "function"
              ? cellTextProps.column["startAdornment"](cellTextProps.rowData)
              : undefined
          }
          labelEnd={
            typeof cellTextProps.column["endAdornment"] === "function"
              ? cellTextProps.column["endAdornment"](cellTextProps.rowData)
              : undefined
          }
        >
          <ProgressIndicatorSegment width={`${value}%`} color={color} label={`${value}%`} />
        </ProgressIndicator>
      </Align>
    </Stack>
  )
}

export const CellStatus = (cellTextProps: ICellTextProps | ICellEditorProps) => {
  const status = cellTextProps.column["status"] as Column["status"]

  const { color, label } = status?.configure(cellTextProps.rowData) || {
    color: undefined,
    label: undefined,
  }

  return (
    <Stack hug horizontal>
      <Align horizontal left>
        {color && label ? (
          <Badge size="large" variant="transparent" color={color} iconName="circle" label={label} />
        ) : (
          <Text fill={[Color.Neutral, 700]} small monospace>
            –
          </Text>
        )}
      </Align>
    </Stack>
  )
}

export const CellIcon = (cellTextProps: ICellTextProps | ICellEditorProps) => {
  const column = cellTextProps.column as Column
  const icon = column.icon
  const iconConfig = icon?.configure(cellTextProps.rowData)

  return (
    <Stack hug horizontal>
      <Align horizontal center>
        {iconConfig ? <Icon name={iconConfig.name} fill={iconConfig.color} medium /> : null}
      </Align>
    </Stack>
  )
}
