import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { StackProps } from "../Stack/Stack"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { generateErrorClassName, generateErrorStyles, useValidateChildren } from "@new/useValidateChildren"
import { SpacerProps } from "@new/Stack/Spacer"
import { DividerProps } from "@new/Divider/Divider"

const Outer = styled.div<Pick<PageBoundsProps, "validateChildrenErrorStyles">>(p => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "flex-start",
  alignItems: "flex-start",

  ...p.validateChildrenErrorStyles,
}))

const Inner = styled(Outer)({
  maxWidth: "1280px",
  padding: "0 calc(var(--BU) * 4)",
})

export type PageBoundsProps = ComponentBaseProps & {
  children:
    | ReactElement<StackProps | SpacerProps | DividerProps>
    | ReactElement<StackProps | SpacerProps | DividerProps>[]
}

export const PageBounds = (p: PageBoundsProps) => {
  const [invalidChildren] = useValidateChildren("Stack", ["Stack", "Spacer", "Divider"], ["PageBounds"], p.children)

  return (
    <Outer
      className={`<PageBounds />${generateErrorClassName(invalidChildren)} component-page_bounds component-composition-reset`}
      data-playwright-testid={p["data-playwright-testid"]}
      validateChildrenErrorStyles={generateErrorStyles(invalidChildren)}
    >
      <Inner className="<PageBounds: children /> - ">{p.children}</Inner>
    </Outer>
  )
}
