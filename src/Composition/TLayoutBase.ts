import { ESize } from "@new/ESize"
import { TPlaywright } from "@new/TPlaywright"

export type TLayoutBase = TPlaywright & {
  id?: string
  omitPadding?: boolean
  spacing?: ESize
}
