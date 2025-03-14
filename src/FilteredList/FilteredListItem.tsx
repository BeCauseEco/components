import { AvatarProps } from "@new/Avatar/Avatar"
import { PlaywrightProps } from "@new/Playwright"

export type FilteredListItemProps = PlaywrightProps &
  AvatarProps & {
    value: string
    label: string
  }

export const FilteredListItem = ({
  // eslint-disable-next-line
  value,
  // eslint-disable-next-line
  label,
}: FilteredListItemProps) => null
