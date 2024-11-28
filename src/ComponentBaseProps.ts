import { PlaywrightProps } from "@new/Playwright"

export type ComponentBaseProps = PlaywrightProps & {
  id?: string
  className?: string
}
