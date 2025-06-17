import { CreateStyled } from "@emotion/styled"

export const makePropsNonTransient = (propNames: string[]): Parameters<CreateStyled>[1] => {
  return {
    shouldForwardProp: (propName: string) => !propNames?.map(pn => pn?.toLowerCase()).includes(propName?.toLowerCase()),
  }
}
