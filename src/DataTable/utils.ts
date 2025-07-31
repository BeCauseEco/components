import { DataType, Column, DataTableProps } from "./types"
import { TABLE_CELL_EMPTY_STRING } from "./internal/constants"

export const createNewRow = (data: DataTableProps["data"]): object => {
  return { id: Math.max(...data.map(d => d.id)) + 1 }
}

export const formatValue = (value: string, dataType: DataType, placeholder?: string): string => {
  const emptyString = placeholder || TABLE_CELL_EMPTY_STRING

  switch (dataType) {
    case DataType.Number:
      return value
        ? new Intl.NumberFormat(undefined, {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(value))
        : emptyString

    case DataType.Date:
      return value ? new Date(value).toLocaleDateString() : emptyString

    case DataType.Boolean:
      return value ? (value === "true" ? "Yes" : "No") : emptyString

    case DataType.String:
      return value || emptyString

    default:
      return emptyString
  }
}

export const csv = (data: DataTableProps["data"], columns: Column[]) => {
  const dataSanitized: DataTableProps["data"] = [columns.map(c => c.title)]

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
