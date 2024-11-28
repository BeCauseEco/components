import { PlaywrightProps } from "@new/Playwright"
import { ReactElement } from "react"

export type InputComboboxItemProps = PlaywrightProps & {
  value: string
  label: string
  icon?: ReactElement
}

export const InputComboboxItem = ({
  // eslint-disable-next-line
  value,
  // eslint-disable-next-line
  label,
  // eslint-disable-next-line
  icon,
}: InputComboboxItemProps) => null
