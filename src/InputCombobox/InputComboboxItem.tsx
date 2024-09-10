import { EColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"

export type TInputComboboxItem = TPlaywright & {
  label: string
  value: string | boolean
  colorBackground: EColor
  colorBackgroundHover: EColor
  colorForeground: EColor
}

export const InputComboboxItem = ({
  // eslint-disable-next-line
  label,
  // eslint-disable-next-line
  value,
}: TInputComboboxItem) => null
