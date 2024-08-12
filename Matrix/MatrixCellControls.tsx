import React from "react"
import { TMatrixCellControlsRenderMode, IMatrixCell } from "./types"
import { EColor } from "@new/Color"
import { Text } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { EDirection } from "@new/EDirection"
import { Composition } from "@new/Composition/Composition"
import { LayoutSingle } from "@new/Composition/LayoutSingle"
import { assertUnreachable } from "../../../types/assertNever"
import DataPointInput, {
  IDataPointInput,
} from "../../pages/managers/company-manager/tabs/performance/components/questions/DataPointInput"

type INoDataPointCell = "Empty" | "Text"

const NoDataPointControlInputPreview = ({
  configuration,
  renderMode,
}: {
  configuration: { type: INoDataPointCell; text: string; isBold: boolean }
  renderMode: TMatrixCellControlsRenderMode
}) => {
  const type = configuration.type

  switch (type) {
    case "Text":
      return (
        <Text size={ESize.Xsmall} color={[EColor.Black, 700]} emphasize={configuration.isBold}>
          {configuration.text}
        </Text>
      )
    case "Empty":
      return (
        <Text size={ESize.Xsmall} color={[EColor.Black, 700]}>
          {renderMode === "PreviewWithControls" ? <>&ndash;</> : <>&nbsp;</>}
        </Text>
      )
    default:
      assertUnreachable(type)
  }
}

export interface IMatrixCellDataPointControlInput
  extends Pick<
    IDataPointInput,
    "dataPoint" | "filter" | "reportingPeriodFilter" | "targetProfileId" | "dataSourceProfileId" | "variant"
  > {}

const MatrixCellDataPointControlInput = ({
  dataPoint,
  filter,
  reportingPeriodFilter,
  targetProfileId,
  dataSourceProfileId,
  variant,
}: IMatrixCellDataPointControlInput) => {
  return (
    <DataPointInput
      dataPoint={dataPoint}
      filter={filter}
      reportingPeriodFilter={reportingPeriodFilter}
      targetProfileId={targetProfileId}
      dataSourceProfileId={dataSourceProfileId}
      isTwelveInputs={false}
      displayVariant={"compact"}
      variant={variant}
    />
  )
}

const previewKeysForDisplay = ["type", "text", "title"]

interface IMatrixInputPreview extends Omit<IMatrixCellDataPointControlInput, "dataPoint"> {
  cell: IMatrixCell
  renderMode: TMatrixCellControlsRenderMode
}

export const MatrixInputPreview = ({
  cell,
  renderMode,
  filter,
  reportingPeriodFilter,
  targetProfileId,
  dataSourceProfileId,
  variant,
}: IMatrixInputPreview) => {
  if (renderMode === "ActualControls" || renderMode === "PreviewWithControls") {
    if (cell.configuration.type === "DataPoint") {
      if (!cell.dataPoint) {
        // This happens when the cell configuration points to a data-point-id that does not exist on any data-point in the data-point-cluster,
        // indicating bad DB data.
        // Throwing here since the later code will crash anyway when it does not get a data-point as expected.
        throw new Error(`Data point does not exist ${cell.configuration.dataPointId}`)
      }
      return (
        <MatrixCellDataPointControlInput
          dataPoint={cell.dataPoint}
          filter={filter}
          reportingPeriodFilter={reportingPeriodFilter}
          targetProfileId={targetProfileId}
          dataSourceProfileId={dataSourceProfileId}
          variant={variant}
        />
      )
    } else {
      return (
        <NoDataPointControlInputPreview
          configuration={cell.configuration as { type: INoDataPointCell; text: string; isBold: boolean }}
          renderMode={renderMode}
        />
      )
    }
  } else {
    const configuration =
      cell.configuration.type === "DataPoint" ? cell.dataPoint!.typeConfigurations[0] : cell.configuration
    const Preview = Object.keys(configuration).map((key, index) => {
      if (!configuration[key] || !previewKeysForDisplay.includes(key)) {
        return null
      }
      const isTitleProp = cell.configuration.type === "Text" && key === "type"
      return (
        <KeyValuePair key={index} direction={EDirection.Horizontal} spacing={ESize.Tiny}>
          <Text size={ESize.Tiny} color={[EColor.Black, 200]} emphasize>
            {key}
          </Text>
          <Text
            size={ESize.Xsmall}
            color={[EColor.Black, 200]}
            emphasize={(cell.configuration.isBold ?? false) && cell.configuration.type === "Text" && key === "text"}
          >
            {JSON.stringify(isTitleProp ? "Title" : configuration[key])}
          </Text>
        </KeyValuePair>
      )
    })

    return (
      <Composition>
        <LayoutSingle direction={EDirection.Vertical} content={Preview} omitPadding />
      </Composition>
    )
  }
}

export default MatrixInputPreview
