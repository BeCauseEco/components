import { Size } from "@new/Size"
import { PlaywrightProps } from "@new/Playwright"

export type TLayoutBase = PlaywrightProps & {
  id?: string
  omitPadding?: boolean
  spacing?: Size
}
