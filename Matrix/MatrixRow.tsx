import React from "react"
import { IMatrixCellProps, MatrixCell } from "@new/Matrix/MatrixCell"
import { IMatrixRowInternal } from "@new/Matrix/types"
import { TableRow } from "@new/Table/TableRow"

export interface IMatrixRowProps extends Omit<IMatrixCellProps, "cell"> {
  row: IMatrixRowInternal
}

export const MatrixRow = ({
  matrix,
  row,
  dataPointClusterId,
  filter,
  reportingPeriodFilter,
  targetProfileId,
  dataSourceProfileId,
}: IMatrixRowProps) => {
  return (
    <TableRow>
      {row.cells.map((cell, index) => (
        <MatrixCell
          matrix={matrix}
          key={index}
          cell={cell}
          dataPointClusterId={dataPointClusterId}
          filter={filter}
          reportingPeriodFilter={reportingPeriodFilter}
          targetProfileId={targetProfileId}
          dataSourceProfileId={dataSourceProfileId}
        />
      ))}
    </TableRow>
  )
}
