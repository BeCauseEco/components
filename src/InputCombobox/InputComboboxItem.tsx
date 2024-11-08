import { Color } from "@new/Color"
import { Playwright } from "@new/Playwright"
import { ReactElement } from "react"

export type TInputComboboxItem = Playwright & {
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
