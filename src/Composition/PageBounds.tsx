import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { TComposition } from "./Composition"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1024px",
})

export type TPageBounds = {
  children: ReactElement<TComposition>
}

export const PageBounds = ({ children }: TPageBounds) => (
  <Container className="component-page_bounds component-composition-reset">{children}</Container>
)
