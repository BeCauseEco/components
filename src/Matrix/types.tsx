import { QuestionDataPointModel } from "src/api/questions/questions/models/models/questionDataPointModel"

import { Guid } from "src/types/baseTypes"
import { TableCellType } from "../../../api/questions/questions/models/models/dataPointClusterModel"

export interface IMatrixRow {
  cells: IMatrixCell[]
}

export interface IMatrixRowInternal {
  cells: IMatrixCellInternal[]
}

export interface IMatrixCell {
  dataPoint?: QuestionDataPointModel
  configuration: { type: TableCellType; dataPointId: Guid | null; text: string | null; isBold: boolean | null }
}

export interface IMatrixCellInternal extends IMatrixCell {
  rowIndex: number
  columnIndex: number
}

export type TMatrixCellControlsRenderMode = "SimplifiedPreview" | "PreviewWithControls" | "ActualControls"

export interface IMatrix {
  rows: IMatrixRowInternal[]
}

export interface IMatrixInternal extends IMatrix {
  cellControlsRenderMode: TMatrixCellControlsRenderMode

  setCellValue: (value: IMatrixCell) => void
}

export interface IMatrixInstance {
  matrix: IMatrix
  addEmptyRow(initializer: (rowIndex?: number, cellIndex?: number) => IMatrixCell): void
  addEmptyColumn(initializer: (rowIndex?: number, cellIndex?: number) => IMatrixCell): void
  removeLastRow(): void
  removeLastColumn(): void
}

export type TMatrixCellValuesChange = (cells: IMatrixCellInternal[]) => void
