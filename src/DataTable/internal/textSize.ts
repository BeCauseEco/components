import { DataTableTextSize } from "../types"

export const TEXT_SIZE_CLASS: Record<DataTableTextSize, string> = {
  xxtiny: "text-[8px] leading-[12px]",
  xtiny: "text-[10px] leading-[14px]",
  tiny: "text-tiny",
  xsmall: "text-xs",
  small: "text-sm",
  medium: "text-md",
  large: "text-lg",
}

export const sizeClass = (override: DataTableTextSize | undefined, fallback: DataTableTextSize): string =>
  TEXT_SIZE_CLASS[override ?? fallback]
