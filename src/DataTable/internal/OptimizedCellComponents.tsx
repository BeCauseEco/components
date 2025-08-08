import React, { memo } from "react"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Text } from "@new/Text/Text"
import { Color, Lightness } from "@new/Color"
import { Avatar } from "@new/Avatar/Avatar"
import { Spacer } from "@new/Stack/Spacer"
import Link from "next/link"
import { Column, DataType } from "../types"
import { formatValue } from "../utils"
import { TABLE_CELL_EMPTY_STRING } from "./constants"
import styled from "@emotion/styled"

const AdornmentCenteringContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: "center";
`

interface OptimizedCellProps {
  column: Column
  value: any
  rowData: any
  rowKeyValue: any
  firstColumn: boolean
  tooltipElement?: React.ReactNode
  textSize?: "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large"
  // Include all props from cellTextContent
  [key: string]: any
}

// Memoized cell component for better performance
export const OptimizedCell = memo(
  (props: OptimizedCellProps) => {
    const { column, value, rowData, textSize = "small" } = props
    const alignmentRight = column.dataType === DataType.Number

    // Apply number formatting with precedence hierarchy:
    // 1. Custom configure() function takes absolute priority
    // 2. defaultTrailingDecimals from column configuration
    // 3. Global default (2 decimal places) handled in formatValue
    let text: string
    if (column.dataType === DataType.Number && column.numberFormat?.configure && typeof value === "number") {
      // Priority 1: Custom configure() function overrides all other formatting
      text = column.numberFormat.configure(value, rowData)
    } else {
      // Priority 2 & 3: Use defaultTrailingDecimals or global default
      text = formatValue(
        value?.toString(), 
        column.dataType || DataType.String, 
        column.placeholder,
        column.numberFormat?.defaultTrailingDecimals  // Falls back to global default if undefined
      )
    }

    if (column.dataType === DataType.List) {
      const selectedOption = rowData?.selectableOptions?.find((o: any) => o.value === value)
      if (!selectedOption) {
        return <></>
      }
      return (
        <Align horizontal left>
          <Text fill={[Color.Neutral, 700]} {...{[textSize]: true}} textOverflow={column.maxWidth !== undefined}>
            {selectedOption.label}
          </Text>
        </Align>
      )
    }

    // Regular cell rendering
    const monospace =
      column.dataType === DataType.Date || column.dataType === DataType.Number || column.dataType === DataType.Boolean

    // Get dynamic values
    const avatarValue = typeof column.avatar === "function" ? column.avatar(rowData) : column.avatar
    const linkEffect = typeof column.link === "function" ? column.link(rowData) : undefined
    const fillColor = typeof column.fill === "function" ? column.fill(rowData) : column.fill
    const startAdornment = column?.startAdornment?.(rowData)
    const endAdornment = column?.endAdornment?.(rowData)

    const avatarElement = avatarValue ? (
      <>
        {typeof avatarValue === "string" ? <Avatar size="small" src={avatarValue} title={text} /> : avatarValue}
        <Spacer xsmall />
      </>
    ) : null

    const getColorWithLightness = (color: Color | undefined, lightness: Lightness = 700): [Color, Lightness] => {
      if (typeof color === "undefined") {
        return [Color.Neutral, lightness]
      }
      return [color, lightness]
    }

    const emptyString = column.placeholder || TABLE_CELL_EMPTY_STRING
    if (linkEffect && text !== emptyString) {
      return (
        <>
          {avatarElement}
          <Text fill={[Color.Neutral, 700]} {...{[textSize]: true}} monospace={monospace} textOverflow={column.maxWidth !== undefined}>
            {typeof linkEffect === "string" ? (
              <Link href={linkEffect}>{text}</Link>
            ) : (
              <a href="javascript: void(0);" onClick={linkEffect}>
                {text}
              </a>
            )}
          </Text>
        </>
      )
    }

    return (
      <Stack
        horizontal
        hug={typeof fillColor !== "undefined" ? "partly" : true}
        fill={typeof fillColor !== "undefined" ? getColorWithLightness(fillColor, 100) : undefined}
        cornerRadius="small"
      >
        <>
          {avatarElement}
          {startAdornment && (
            <>
              <AdornmentCenteringContainer>{startAdornment}</AdornmentCenteringContainer>
              <Spacer xsmall />
            </>
          )}
          <Align horizontal right={alignmentRight} left={!alignmentRight}>
            <Text
              fill={getColorWithLightness(fillColor, 700)}
              {...{[textSize]: true}}
              monospace={monospace}
              textOverflow={column.maxWidth !== undefined}
            >
              {text}
            </Text>
          </Align>
          {endAdornment && (
            <>
              <Spacer xsmall />
              {endAdornment}
            </>
          )}
        </>
      </Stack>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison function for better memoization
    return (
      prevProps.value === nextProps.value &&
      prevProps.column.key === nextProps.column.key &&
      prevProps.rowData === nextProps.rowData &&
      prevProps.firstColumn === nextProps.firstColumn &&
      prevProps.tooltipElement === nextProps.tooltipElement &&
      prevProps.textSize === nextProps.textSize
    )
  },
)

OptimizedCell.displayName = "OptimizedCell"
