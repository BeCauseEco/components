import React, { memo } from "react"
import { Avatar } from "@new/Avatar/Avatar"
import Link from "next/link"
import { Color, Lightness, computeColor } from "@new/Color"
import { Column, DataType } from "../types"
import { formatValue } from "../utils"
import { TABLE_CELL_EMPTY_STRING } from "./constants"

interface OptimizedCellProps {
  column: Column
  value: any
  rowData: any
  rowKeyValue: any
  firstColumn: boolean
  tooltipElement?: React.ReactNode
  textSize?: "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large"
  [key: string]: any
}

const textSizeClass: Record<NonNullable<OptimizedCellProps["textSize"]>, string> = {
  xxtiny: "text-[8px] leading-[12px]",
  xtiny: "text-[10px] leading-[14px]",
  tiny: "text-tiny",
  xsmall: "text-xs",
  small: "text-sm",
  medium: "text-md",
  large: "text-lg",
}

const textColor = (color: Color | undefined, lightness: Lightness): string =>
  computeColor([color ?? Color.Neutral, lightness]) ?? ""

export const OptimizedCell = memo(
  (props: OptimizedCellProps) => {
    const { column, value, rowData, textSize = "small" } = props
    const alignmentRight = column.dataType === DataType.Number

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

    const sizeCls = textSizeClass[textSize]

    if (column.dataType === DataType.List) {
      const selectedOption = rowData?.selectableOptions?.find((o: any) => o.value === value)
      if (!selectedOption) {
        return null
      }
      const truncate = column.maxWidth !== undefined ? "overflow-hidden text-ellipsis" : ""
      return (
        <span className={`tw inline-block ${sizeCls} ${truncate}`} style={{ color: textColor(undefined, 700) }}>
          {selectedOption.shortLabel || selectedOption.label}
        </span>
      )
    }

    const monospaceCls =
      column.dataType === DataType.Date || column.dataType === DataType.Number || column.dataType === DataType.Boolean
        ? "font-mono"
        : ""
    const truncateCls = column.maxWidth !== undefined ? "overflow-hidden text-ellipsis whitespace-nowrap" : ""

    const avatarValue = typeof column.avatar === "function" ? column.avatar(rowData) : column.avatar
    const linkEffect = typeof column.link === "function" ? column.link(rowData) : undefined
    const fillColor = typeof column.fill === "function" ? column.fill(rowData) : column.fill
    const startAdornment = column?.startAdornment?.(rowData)
    const endAdornment = column?.endAdornment?.(rowData)

    const avatarElement = avatarValue ? (
      typeof avatarValue === "string" ? (
        <Avatar size="small" src={avatarValue} title={text} />
      ) : (
        avatarValue
      )
    ) : null

    const textCls = `tw ${sizeCls} ${monospaceCls} ${truncateCls}`
    const textStyle = { color: textColor(fillColor, 700) }

    const emptyString = column.placeholder || TABLE_CELL_EMPTY_STRING
    if (linkEffect && text !== emptyString) {
      return (
        <span className="tw flex items-center gap-1">
          {avatarElement}
          <span className={textCls} style={textStyle}>
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

    const isPlain = !avatarElement && !startAdornment && !endAdornment && !fillColor
    if (isPlain) {
      return <span className={textCls} style={textStyle}>{text}</span>
    }

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
        <span className={textCls} style={textStyle}>{text}</span>
        {endAdornment}
      </span>
    )
  },
  (prevProps, nextProps) => {
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
