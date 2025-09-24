import { PlaywrightProps } from "@new/Playwright"
import { ReactElement } from "react"

export type InputComboboxItemProps = PlaywrightProps & {
  value: string
  label: string
  icon?: ReactElement
  /**
   * Optional grouping label that controls how items are displayed in the dropdown.
   *
   * - `undefined` or `""`: Item goes into "Other" group (only if other grouped items exist)
   * - `"-"`: Item displayed under a divider line (no group heading)
   * - Any other string: Item goes into named group with that heading
   */
  groupingLabel?: string
}

export const InputComboboxItem = ({
  // eslint-disable-next-line
  value,
  // eslint-disable-next-line
  label,
  // eslint-disable-next-line
  icon,
  // eslint-disable-next-line
  groupingLabel,
}: InputComboboxItemProps) => null
