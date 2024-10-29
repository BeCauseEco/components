import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { TPlaywright } from "@new/TPlaywright"
import { TStack } from "@new/Stack/Stack"

const Outer = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "flex-start",
  alignItems: "flex-start",
})

const Inner = styled(Outer)({
  maxWidth: "1024px",
  padding: "0 calc(var(--BU) * 4)",
})

export type TPageBounds = TPlaywright & {
  children: ReactElement<TStack> | ReactElement<TStack>[]
}

export const PageBounds = ({ children, playwrightTestId }: TPageBounds) => (
  <Outer className="component-page_bounds component-composition-reset" data-playwright-testid={playwrightTestId}>
    <Inner>{children}</Inner>
  </Outer>
)
