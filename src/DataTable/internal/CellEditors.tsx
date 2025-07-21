import { useEffect, useRef } from "react"
import { useTableInstance } from "ka-table"
import { ICellEditorProps } from "ka-table/props"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { InputTextDate } from "@new/InputText/InputTextDate"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { InputCombobox } from "@new/InputCombobox/InputCombobox"
import { InputComboboxItem } from "@new/InputCombobox/InputComboboxItem"
import { Color } from "@new/Color"
import { DataType } from "../types"

export const CellInputTextSingle = ({ column, rowKeyValue, value, autoFocus }: ICellEditorProps) => {
  const table = useTableInstance()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const displayValue =
    column.dataType === DataType.Number && typeof value === "string" ? value.replace(/,/g, ".") : value

  return (
    <InputTextSingle
      ref={inputRef}
      value={displayValue ?? ""}
      width="auto"
      size="small"
      color={Color.Neutral}
      onChange={v => {
        if (column.dataType === DataType.Number) {
          const normalized = v.replace(/,/g, ".").replace(/[^0-9.]/g, "")
          if (normalized === "" || normalized === ".") {
            table.updateCellValue(rowKeyValue, column.key, undefined)
            return
          }
          if (/^\d*\.?\d*$/.test(normalized)) {
            table.updateCellValue(rowKeyValue, column.key, normalized)
          }
        } else {
          table.updateCellValue(rowKeyValue, column.key, v)
        }
      }}
    />
  )
}

export const CellInputTextDate = ({ column, rowKeyValue, value }: ICellEditorProps) => {
  const table = useTableInstance()

  return (
    <InputTextDate
      value={value ? new Date(value).toISOString().slice(0, 10) : ""}
      width="auto"
      size="small"
      onChange={v => {
        table.updateCellValue(rowKeyValue, column.key, v)
      }}
      color={Color.Neutral}
    />
  )
}

export const CellInputCheckbox = ({ column, rowKeyValue, value }: ICellEditorProps) => {
  const table = useTableInstance()

  return (
    <InputCheckbox
      value={value || false}
      size="small"
      disabled
      onChange={v => {
        table.updateCellValue(rowKeyValue, column.key, v)
      }}
      color={Color.Neutral}
    />
  )
}

export const CellInputCombobox = ({ column, rowKeyValue, value, rowData }: ICellEditorProps) => {
  const table = useTableInstance()

  if (!rowData.selectableOptions || rowData.selectableOptions.length === 0) {
    return null
  }
  return (
    <InputCombobox
      textNoSelection=""
      value={value}
      onChange={v => {
        table.updateCellValue(rowKeyValue, column.key, v)
      }}
      size="small"
      width="auto"
      color={Color.Neutral}
    >
      {rowData.selectableOptions.map(option => (
        <InputComboboxItem key={option.value} label={option.label} value={option.value} />
      ))}
    </InputCombobox>
  )
}
