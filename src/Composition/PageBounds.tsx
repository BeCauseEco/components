import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { TComposition } from "./Composition"
import { PlaywrightProps } from "@new/Playwright"
import { StackProps } from "@new/Stack/Stack"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1024px",
  margin: "0 auto",
})

export type TPageBounds = PlaywrightProps & {
  children: ReactElement<TComposition> | ReactElement<StackProps>
}

export const PageBounds = ({ children, playwrightTestId }: TPageBounds) => (
  <Container className="component-page_bounds component-composition-reset" data-playwright-testid={playwrightTestId}>
    {children}
  </Container>
)
