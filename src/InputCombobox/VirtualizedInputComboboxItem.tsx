import { EColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"
import { ReactElement } from "react"

export type TVirtualizedInputComboboxItem = TPlaywright & {
  id: string
  label: string
  value: string | boolean
  colorBackground: EColor
  colorBackgroundHover: EColor
  colorForeground: EColor
  icon?: ReactElement
}

export const VirtualizedInputComboboxItem = ({
  // eslint-disable-next-line
  id,
  // eslint-disable-next-line
  label,
  // eslint-disable-next-line
  value,
  // eslint-disable-next-line
  icon,
}: TVirtualizedInputComboboxItem) => null
