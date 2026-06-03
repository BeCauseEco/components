import React, { memo } from "react"
import { Avatar } from "@new/Avatar/Avatar"
import Link from "next/link"
import { Color, computeColor } from "@new/Color"
import { Column, DataType, DataTableTextSize } from "../types"
import { formatValue } from "../utils"
import { TABLE_CELL_EMPTY_STRING } from "./constants"
import { TEXT_SIZE_CLASS } from "./textSize"

interface OptimizedCellProps {
  column: Column
  value: any
  rowData: any
  rowKeyValue: any
  firstColumn: boolean
  tooltipElement?: React.ReactNode
  /** Pre-built info icon (with its own tooltip) rendered inline after the content when `showTooltipIcon` is set. */
  tooltipIcon?: React.ReactNode
  textSize?: DataTableTextSize
  [key: string]: any
}

const NEUTRAL_700 = computeColor([Color.Neutral, 700]) ?? ""

export const OptimizedCell = memo(
  (props: OptimizedCellProps) => {
    const { column, value, rowData, textSize = "small" } = props
    const sizeCls = TEXT_SIZE_CLASS[textSize]
    const cellStyle: React.CSSProperties =
      (typeof column.cellStyle === "function" ? column.cellStyle(rowData) : column.cellStyle) ?? {}

    let text: string
    if (column.dataType === DataType.Number && column.numberFormat?.configure && typeof value === "number") {
      text = column.numberFormat.configure(value, rowData)
    } else if (
      column.dataType === DataType.Date &&
      column.dateFormat?.configure &&
      (typeof value === "string" || value instanceof Date)
    ) {
      text = column.dateFormat.configure(value, rowData)
    } else {
      text = formatValue(
        value?.toString(),
        column.dataType || DataType.String,
        column.placeholder,
        column.numberFormat?.defaultTrailingDecimals,
        column.dateFormat?.defaultFormat,
      )
    }

    if (column.dataType === DataType.List) {
      const selectedOption = rowData?.selectableOptions?.find((o: any) => o.value === value)
      if (!selectedOption) {
        return null
      }
      const listLabel = (
        <span
          className={`tw inline-block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${sizeCls}`}
          style={{ color: NEUTRAL_700, ...cellStyle }}
        >
          {selectedOption.shortLabel || selectedOption.label}
        </span>
      )
      if (!props.tooltipIcon) {
        return listLabel
      }
      return (
        <span className="tw flex items-center gap-1">
          {listLabel}
          {props.tooltipIcon}
        </span>
      )
    }

    const monospaceCls =
      column.dataType === DataType.Date || column.dataType === DataType.Number || column.dataType === DataType.Boolean
        ? "font-mono"
        : ""
    const baseTextCls = `tw min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${sizeCls} ${monospaceCls}`

    if (
      !column.avatar &&
      !column.link &&
      !column.fill &&
      !column.startAdornment &&
      !column.endAdornment &&
      !column.suffixAdornment &&
      !props.tooltipIcon
    ) {
      return (
        <span className={baseTextCls} style={{ color: NEUTRAL_700, ...cellStyle }}>
          {text}
        </span>
      )
    }

    const avatarValue = typeof column.avatar === "function" ? column.avatar(rowData) : column.avatar
    const linkEffect = typeof column.link === "function" ? column.link(rowData) : undefined
    const fillColor = typeof column.fill === "function" ? column.fill(rowData) : column.fill
    const startAdornment = column.startAdornment?.(rowData)
    const suffixAdornment = column.suffixAdornment?.(rowData)
    const endAdornment = column.endAdornment?.(rowData)

    const avatarElement = avatarValue ? (
      typeof avatarValue === "string" ? (
        <Avatar size="small" src={avatarValue} title={text} />
      ) : (
        avatarValue
      )
    ) : null

    const textColor = fillColor ? computeColor([fillColor, 700]) : NEUTRAL_700
    const textCls = baseTextCls

    const emptyString = column.placeholder || TABLE_CELL_EMPTY_STRING
    if (linkEffect && text !== emptyString) {
      return (
        <span className="tw flex items-center gap-1">
          {avatarElement}
          <span className={textCls} style={{ color: textColor, ...cellStyle }}>
            {typeof linkEffect === "string" ? (
              <Link href={linkEffect}>{text}</Link>
            ) : (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  linkEffect()
                }}
              >
                {text}
              </a>
            )}
          </span>
        </span>
      )
    }

    const alignmentRight = column.dataType === DataType.Number
    const justify = alignmentRight ? "justify-end" : "justify-start"

    const content = (
      <>
        {avatarElement}
        {startAdornment}
        <span className={textCls} style={{ color: textColor, ...cellStyle }}>
          {text}
        </span>
        {suffixAdornment}
        {props.tooltipIcon}
      </>
    )

    // With an end adornment, the content takes the available width (so the text truncates
    // gracefully) and the adornment stays its natural size pinned to the end of the cell.
    if (endAdornment) {
      return (
        <span className={`tw flex w-full items-center gap-1 ${justify}`}>
          <span className="tw flex min-w-0 flex-1 items-center gap-1">{content}</span>
          <span className="tw flex shrink-0 items-center gap-1">{endAdornment}</span>
        </span>
      )
    }

    return <span className={`tw flex items-center gap-1 ${justify}`}>{content}</span>
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.column === next.column &&
    prev.rowData === next.rowData &&
    prev.firstColumn === next.firstColumn &&
    prev.tooltipElement === next.tooltipElement &&
    prev.tooltipIcon === next.tooltipIcon &&
    prev.textSize === next.textSize,
)

OptimizedCell.displayName = "OptimizedCell"
