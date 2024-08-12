import React from "react"
import { useState } from "react"
import { IMatrixCellInternal, IMatrixInternal } from "@new/Matrix/types"
import { TableCell } from "@new/Table/TableCell"
import { EPopoverOverflowBehavior, Popover } from "@new/Popover/Popover"
import styled from "@emotion/styled"
import { LayoutSingle } from "@new/Composition/LayoutSingle"
import { EColor, computeColor } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { ESize } from "@new/ESize"
import { EShadow } from "@new/EShadow"
import TypeConfigurationEditor from "src/components/performance/questions/edit-questions/editor/dataPoints/TypeConfigurationEditor"
import MatrixCellControls, { IMatrixCellDataPointControlInput } from "@new/Matrix/MatrixCellControls"
import { useGuid } from "../../../hooks/guid/useGuid"
import { Guid } from "../../../types/baseTypes"
import { isQuestionDataPointType } from "../../../api/questions/questions/models/models/questionDataPointModel"
import { EDirection } from "@new/EDirection"
import { TableCellType } from "../../../api/questions/questions/models/models/dataPointClusterModel"
import { assertUnreachable } from "../../../types/assertNever"
import { Text } from "@new/Text/Text"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { EAlignment } from "@new/EAlignment"

const MATRIX_CELL_SELECTABLE_ANSWERS = [
  { id: "Empty", label: "Empty" },
  { id: "Title", label: "Title" },
] as const
type TMatrixCellSelectableAnswerType = (typeof MATRIX_CELL_SELECTABLE_ANSWERS)[number]["id"]
const SelectableAnswerTypeToConfigurationType = (type: TMatrixCellSelectableAnswerType): TableCellType => {
  switch (type) {
    case "Empty":
      return "Empty"
    case "Title":
      return "Text"
    default:
      return assertUnreachable(type)
  }
}
const ConfigurationTypeToSelectableAnswerType = (type: TableCellType): TMatrixCellSelectableAnswerType => {
  switch (type) {
    case "Empty":
      return "Empty"
    case "Text":
      return "Title"
    case "DataPoint":
      throw new Error("DataPoint configuration-type cannot be converted to Empty or Title.")
    default:
      return assertUnreachable(type)
  }
}

const Trigger = styled.div({
  display: "flex",
  width: "fit-content",
  height: "100%",
  zIndex: 0,
  cursor: "pointer",

  "&:hover": {
    backgroundColor: computeColor([EColor.Black, 100]),
  },

  "& > *": {
    pointerEvents: "none",
  },
})

const PreviewContent = ({
  setCell,
  matrix,
  cell,
  dataPointClusterId,
}: {
  setCell: (v: IMatrixCellInternal) => void
  matrix: IMatrixInternal
  cell: IMatrixCellInternal
  dataPointClusterId: Guid
}) => {
  const { createGuid } = useGuid()
  return (
    <>
      <TypeConfigurationEditor
        typeConfiguration={
          cell.configuration.type === "DataPoint"
            ? cell.dataPoint!.typeConfigurations[0]
            : ({
                title: cell.configuration.text ?? undefined,
                type: ConfigurationTypeToSelectableAnswerType(cell.configuration.type),
              } as any)
        }
        onChange={v => {
          if (!cell.dataPoint) {
            return
          }
          cell.dataPoint.typeConfigurations[0] = { ...cell.dataPoint.typeConfigurations[0], ...v }
          setCell(cell)
          matrix.setCellValue(cell)
        }}
        additionalAnswerTypes={[
          { id: "Empty", label: "Empty" },
          { id: "Title", label: "Title" },
        ]}
        onChangeType={type => {
          if (type === "Empty" || type === "Title") {
            cell.configuration.type = SelectableAnswerTypeToConfigurationType(type)
            if (cell.dataPoint) {
              cell.dataPoint.isDeleted = true
            }
            setCell(cell)
            matrix.setCellValue(cell)
          } else if (!cell.dataPoint) {
            if (!isQuestionDataPointType(type)) {
              throw new Error(`Invalid data-point type ${type}.`)
            }
            const id = createGuid()
            const newValue: IMatrixCellInternal = {
              ...cell,
              dataPoint: {
                id,
                dataPointClusterId,
                displayOrderIndex: 0,
                isDeleted: false,
                typeConfigurations: [
                  {
                    type: type,
                    title: cell.configuration.text ?? undefined,
                  },
                ],
              },
              configuration: { ...cell.configuration, dataPointId: id, type: "DataPoint" },
            }
            setCell(newValue)
            matrix.setCellValue(newValue)
          } else if (isQuestionDataPointType(type)) {
            cell.configuration.type = "DataPoint"
            cell.dataPoint.typeConfigurations[0].type = type
            cell.dataPoint.isDeleted = false
            setCell(cell)
            matrix.setCellValue(cell)
          } else {
            throw new Error(`Invalid data-point type ${type}.`)
          }
        }}
        onChangeTitle={newTitle => {
          cell.configuration.text = newTitle
          setCell(cell)
          matrix.setCellValue(cell)
        }}
      />
      <InputCheckbox
        value={cell.configuration.isBold ?? false}
        onChange={newIsBold => {
          cell.configuration.isBold = newIsBold
          setCell(cell)
          matrix.setCellValue(cell)
        }}
        colorBackground={EColor.Primary}
        colorForeground={EColor.White}
        label={
          <Text color={[EColor.Primary, 700]} size={ESize.Xsmall}>
            Bold
          </Text>
        }
      />
    </>
  )
}

export interface IMatrixCellProps extends Omit<IMatrixCellDataPointControlInput, "variant" | "dataPoint"> {
  matrix: IMatrixInternal
  cell: IMatrixCellInternal
  dataPointClusterId: Guid
}

export const MatrixCell = ({
  matrix,
  cell,
  dataPointClusterId,
  filter,
  reportingPeriodFilter,
  targetProfileId,
  dataSourceProfileId,
}: IMatrixCellProps) => {
  const [value, setValue] = useState(cell)

  const matrixCellControls = (
    <MatrixCellControls
      cell={value}
      renderMode={matrix.cellControlsRenderMode}
      filter={filter}
      reportingPeriodFilter={reportingPeriodFilter}
      targetProfileId={targetProfileId}
      dataSourceProfileId={dataSourceProfileId}
      variant={matrix.cellControlsRenderMode === "ActualControls" ? "Regular" : "Preview"}
    />
  )

  return (
    <TableCell>
      <Popover
        alignment={EAlignment.Start}
        overflowBehavior={EPopoverOverflowBehavior.OverflowScroll}
        trigger={
          matrix.cellControlsRenderMode === "ActualControls" ? (
            matrixCellControls
          ) : (
            <Trigger>{matrixCellControls}</Trigger>
          )
        }
        background={
          <BackgroundCard colorBackground={[EColor.White, 200]} borderRadius={ESize.Tiny} shadow={EShadow.Medium} />
        }
        layout={
          <LayoutSingle
            direction={EDirection.Vertical}
            content={
              <PreviewContent matrix={matrix} cell={value} setCell={setValue} dataPointClusterId={dataPointClusterId} />
            }
          />
        }
      />
    </TableCell>
  )
}
