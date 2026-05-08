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
  textSize?: DataTableTextSize
  [key: string]: any
}

const NEUTRAL_700 = computeColor([Color.Neutral, 700]) ?? ""

export const OptimizedCell = memo(
  (props: OptimizedCellProps) => {
    const { column, value, rowData, textSize = "small" } = props
    const sizeCls = TEXT_SIZE_CLASS[textSize]

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
      const truncate = column.maxWidth !== undefined ? "overflow-hidden text-ellipsis" : ""
      return (
        <span className={`tw inline-block ${sizeCls} ${truncate}`} style={{ color: NEUTRAL_700 }}>
          {selectedOption.shortLabel || selectedOption.label}
        </span>
      )
    }

    const monospaceCls =
      column.dataType === DataType.Date || column.dataType === DataType.Number || column.dataType === DataType.Boolean
        ? "font-mono"
        : ""
    const truncateCls = column.maxWidth !== undefined ? "overflow-hidden text-ellipsis whitespace-nowrap" : ""
    const baseTextCls = `tw ${sizeCls} ${monospaceCls} ${truncateCls}`

    if (!column.avatar && !column.link && !column.fill && !column.startAdornment && !column.endAdornment) {
      return (
        <span className={baseTextCls} style={{ color: NEUTRAL_700 }}>
          {text}
        </span>
      )
    }

    const avatarValue = typeof column.avatar === "function" ? column.avatar(rowData) : column.avatar
    const linkEffect = typeof column.link === "function" ? column.link(rowData) : undefined
    const fillColor = typeof column.fill === "function" ? column.fill(rowData) : column.fill
    const startAdornment = column.startAdornment?.(rowData)
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
          <span className={textCls} style={{ color: textColor }}>
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
    const wrapperStyle: React.CSSProperties = fillColor
      ? { backgroundColor: computeColor([fillColor, fillColor === Color.Neutral ? 50 : 100]) }
      : {}

    return (
      <span
        className={`tw flex items-center gap-1 ${justify} ${fillColor ? "rounded-sm px-2" : ""}`}
        style={wrapperStyle}
      >
        {avatarElement}
        {startAdornment}
        <span className={textCls} style={{ color: textColor }}>
          {text}
        </span>
        {endAdornment}
      </span>
    )
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.column === next.column &&
    prev.rowData === next.rowData &&
    prev.firstColumn === next.firstColumn &&
    prev.tooltipElement === next.tooltipElement &&
    prev.textSize === next.textSize,
)

OptimizedCell.displayName = "OptimizedCell"
