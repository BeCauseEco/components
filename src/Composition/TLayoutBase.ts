import { Size } from "@new/Size"
import { Playwright } from "@new/Playwright"

export type TLayoutBase = Playwright & {
  id?: string
  omitPadding?: boolean
  spacing?: Size
}
