import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { TComposition } from "./Composition"
import { Playwright } from "@new/Playwright"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1024px",
  margin: "0 auto",
})

export type TPageBounds = Playwright & {
  children: ReactElement<TComposition>
}

export const PageBounds = ({ children, playwrightTestId }: TPageBounds) => (
  <Container className="component-page_bounds component-composition-reset" data-playwright-testid={playwrightTestId}>
    {children}
  </Container>
)
