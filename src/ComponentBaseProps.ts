import { PlaywrightProps } from "@new/Playwright"
import { ValidateChildrenErrorStyles } from "./useValidateChildren"

export type ComponentBaseProps = PlaywrightProps & {
  id?: string
  className?: string
  validateChildrenErrorStyles?: ValidateChildrenErrorStyles
}
