import React from "react"
import { MatrixRow } from "@new/Matrix/MatrixRow"
import { Table } from "@new/Table/Table"
import { EColor } from "@new/Color"
import { IMatrix, IMatrixInternal } from "./types"
import { IMatrixCellProps } from "@new/Matrix/MatrixCell"
import { Guid } from "../../../types/baseTypes"
import { useActiveCompany } from "../../../hooks/api/user/userProfiles/ActiveCompanyContext"

export interface IMatrixProps extends Omit<IMatrixCellProps, "cell" | "matrix"> {
  matrix: IMatrix
}

export const MatrixWithPreviewAnswers = ({
  matrix,
  dataPointClusterId,
}: {
  matrix: IMatrix
  dataPointClusterId: Guid
}) => {
  const { activeCompanyId } = useActiveCompany()
  const filter: IMatrixProps["filter"] = {
    year: 2000,
    month: "January",
    reportingPeriodType: "Yearly",
  }
  return (
    <Matrix
      matrix={matrix}
      dataPointClusterId={dataPointClusterId}
      filter={filter}
      reportingPeriodFilter={{
        reportingPeriodFilterYear: filter.year,
        reportingPeriodFilterMonth: filter.month,
        reportingPeriodFilterReportingPeriodType: filter.reportingPeriodType,
      }}
      targetProfileId={activeCompanyId}
      dataSourceProfileId={activeCompanyId}
    />
  )
}

export const Matrix = ({
  matrix,
  dataPointClusterId,
  filter,
  reportingPeriodFilter,
  targetProfileId,
  dataSourceProfileId,
}: IMatrixProps) => (
  <Table
    colorBorder={[EColor.Black, 200]}
    colorRowHover={[EColor.Black, 50]}
    colorCellSeparator={[EColor.Black, 200]}
    body={matrix.rows.map((r, i) => (
      <MatrixRow
        matrix={matrix as IMatrixInternal}
        row={r}
        key={i}
        dataPointClusterId={dataPointClusterId}
        filter={filter}
        reportingPeriodFilter={reportingPeriodFilter}
        targetProfileId={targetProfileId}
        dataSourceProfileId={dataSourceProfileId}
      />
    ))}
  />
)
