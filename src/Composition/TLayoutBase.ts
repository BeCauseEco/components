import { Size } from "@new/Size"
import { TPlaywright } from "@new/TPlaywright"

export type TLayoutBase = TPlaywright & {
  id?: string
  omitPadding?: boolean
  spacing?: Size
}
