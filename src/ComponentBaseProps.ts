import { PlaywrightProps } from "@new/Playwright"
import { ChildrenValidationResult } from "./Functions"

export type ComponentBaseProps = PlaywrightProps & {
  id?: string
  className?: string
  childrenValidationResult?: ChildrenValidationResult
}
