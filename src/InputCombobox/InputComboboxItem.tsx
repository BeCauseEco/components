import { EColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"
import { ReactElement } from "react"

export type TInputComboboxItem = TPlaywright & {
  value: string
  label: string
  colorBackground: EColor
  colorBackgroundHover: EColor
  colorForeground: EColor
  icon?: ReactElement
}

export const InputComboboxItem = ({
  // eslint-disable-next-line
  value,
  // eslint-disable-next-line
  label,
  // eslint-disable-next-line
  icon,
}: TInputComboboxItem) => null
