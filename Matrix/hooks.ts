import { useState } from "react"

import {
  IMatrixCellInternal,
  IMatrixInstance,
  IMatrixInternal,
  IMatrixRow,
  IMatrixRowInternal,
  TMatrixCellControlsRenderMode,
  TMatrixCellValuesChange,
} from "./types"

export const useMatrix = (
  cellControlsRenderMode: TMatrixCellControlsRenderMode,
  getInitialMatrix: () => IMatrixRow[],
  onCellValuesChange?: TMatrixCellValuesChange,
  onRowRemove?: () => void,
  onColumnRemove?: () => void,
): IMatrixInstance => {
  const matrix: IMatrixRowInternal[] = getInitialMatrix().map((r, rowIndex) => ({
    cells: r.cells.map((cell, columnIndex) => {
      return { ...cell, rowIndex, columnIndex }
    }),
  }))

  const [rows, setRows] = useState<IMatrixRow[]>(matrix)

  return {
    matrix: {
      rows,
      cellControlsRenderMode,

      setCellValue: (value: IMatrixCellInternal) => {
        setRows(prev => {
          const r = [...prev]

          rows.forEach((row, rowIndex) => {
            row.cells.forEach((cell, cellIndex) => {
              if (value.rowIndex === rowIndex && value.columnIndex === cellIndex) {
                r[rowIndex].cells[cellIndex].dataPoint = value.dataPoint
                r[rowIndex].cells[cellIndex].configuration = value.configuration
                if (onCellValuesChange) {
                  onCellValuesChange([value])
                }
              }
            })
          })

          return r
        })
      },
    } as IMatrixInternal,

    addEmptyRow: initializer => {
      const r = [...rows]
      const c: IMatrixCellInternal[] = []
      const rowIndex = rows.length

      for (let i = 0; i < rows[0]?.cells?.length; i++) {
        c.push({
          ...initializer(),
          rowIndex: rowIndex,
          columnIndex: i,
        })
      }

      r.push({ cells: c })

      if (onCellValuesChange) {
        onCellValuesChange(c)
      }
      setRows(r)
    },

    addEmptyColumn: initializer => {
      const r = [...rows] as IMatrixRowInternal[]
      const cells: IMatrixCellInternal[] = []

      for (let i = 0; i < rows?.length; i++) {
        const rowIndex = i
        const columnIndex = r[i].cells.length
        const newCell = {
          ...initializer(),
          rowIndex: rowIndex,
          columnIndex: columnIndex,
        }
        r[i].cells.push(newCell)
        cells.push(newCell)
      }

      if (onCellValuesChange) {
        onCellValuesChange(cells)
      }
      setRows(r)
    },

    removeLastRow: () => {
      const r = [...rows]

      if (r.length > 1) {
        const popped = r.pop()

        if (onRowRemove && popped) {
          onRowRemove()
        }
      }

      setRows(r)
    },

    removeLastColumn: () => {
      const r = [...rows]

      for (let i = 0; i < rows?.length; i++) {
        if (r[i].cells.length > 1) {
          r[i].cells.pop()
        }
      }

      if (onColumnRemove) {
        onColumnRemove()
      }

      setRows(r)
    },
  }
}
