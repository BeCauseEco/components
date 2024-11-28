import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { PlaywrightProps } from "@new/Playwright"
import { StackProps } from "../Stack/Stack"

const Outer = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "flex-start",
  alignItems: "flex-start",
})

const Inner = styled(Outer)({
  maxWidth: "1280px",
  padding: "0 calc(var(--BU) * 4)",
})

export type TPageBounds = PlaywrightProps & {
  children: ReactElement<StackProps> | ReactElement<StackProps>[]
}

export const PageBounds = ({ children, playwrightTestId }: TPageBounds) => (
  <Outer
    className="<PageBounds /> - component-page_bounds component-composition-reset"
    data-playwright-testid={playwrightTestId}
  >
    <Inner className="<PageBounds: children /> - ">{children}</Inner>
  </Outer>
)
