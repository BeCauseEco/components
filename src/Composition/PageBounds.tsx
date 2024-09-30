import React, { ReactNode } from "react"
import styled from "@emotion/styled"
import { TComposition } from "./Composition"
import { TPlaywright } from "@new/TPlaywright"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1024px",
  margin: "0 auto",
})

export type TPageBounds = TPlaywright & {
  children: ReactNode<TComposition>
}

export const PageBounds = ({ children, playwrightTestId }: TPageBounds) => (
  <Container className="component-page_bounds component-composition-reset" data-playwright-testid={playwrightTestId}>
    {children}
  </Container>
)
