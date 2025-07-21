import { DataType, Column, DataTableProps } from "./types"
import { TABLE_CELL_EMPTY_STRING } from "./internal/constants"

export const createNewRow = (data: DataTableProps["data"]): object => {
  return { id: Math.max(...data.map(d => d.id)) + 1 }
}

export const formatValue = (value: string, dataType: DataType): string => {
  switch (dataType) {
    case DataType.Number:
      return value
        ? new Intl.NumberFormat(undefined, {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(value))
        : TABLE_CELL_EMPTY_STRING

    case DataType.Date:
      return value ? new Date(value).toLocaleDateString() : TABLE_CELL_EMPTY_STRING

    case DataType.Boolean:
      return value ? (value === "true" ? "Yes" : "No") : TABLE_CELL_EMPTY_STRING

    case DataType.String:
      return value || TABLE_CELL_EMPTY_STRING

    default:
      return TABLE_CELL_EMPTY_STRING
  }
}

export const csv = (data: DataTableProps["data"], columns: Column[]) => {
  const dataSanitized: DataTableProps["data"] = [columns.map(c => c.title)]

  data.forEach(row => {
    const rowSanitized: string[] = []

    columns.forEach(c => {
      const column = c as Column
      const value = (row[column.key] || "").toString()

      if (column.dataType === DataType.Boolean) {
        rowSanitized.push(value !== undefined ? (value ? "Yes" : "No") : "")
      } else if (column.dataType === DataType.String) {
        rowSanitized.push(value.lastIndexOf(";") !== -1 ? `"${value}"` : value)
      } else if (column.dataType === DataType.ProgressIndicator) {
        rowSanitized.push(row[column.key]?.["value"] || "")
      } else {
        rowSanitized.push(value)
      }
    })

    dataSanitized.push(rowSanitized)
  })

  if (window) {
    window.open("data:text/csv;charset=utf-8," + dataSanitized.map(ds => ds.join(";")).join("\n"))
  }
}
