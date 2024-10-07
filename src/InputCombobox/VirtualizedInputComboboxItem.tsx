import { EColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"

export type TVirtualizedInputComboboxItem = TPlaywright & {
  id: string
  label: string
  value: string | boolean
  colorBackground: EColor
  colorBackgroundHover: EColor
  colorForeground: EColor
}

export const VirtualizedInputComboboxItem = ({
  // eslint-disable-next-line
  id,
  // eslint-disable-next-line
  label,
  // eslint-disable-next-line
  value,
}: TVirtualizedInputComboboxItem) => null
