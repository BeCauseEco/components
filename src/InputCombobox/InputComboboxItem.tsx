import { Color } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"
import { ReactElement } from "react"

export type TInputComboboxItem = TPlaywright & {
  value: string
  label: string
  colorBackground: Color
  colorBackgroundHover: Color
  colorForeground: Color
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
