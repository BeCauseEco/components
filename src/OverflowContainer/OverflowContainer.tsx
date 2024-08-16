import styled from "@emotion/styled"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div({
  display: "flex",
  flexDirection: "inherit",
  width: "inherit",
  height: "inherit",
  overflowY: "scroll",
  outline: "solid 1px cyan",
})

export type TOverflowContainer = {
  children: ReactElement | ReactElement[]
}

export const OverflowContainer = ({ children }: PropsWithChildren<TOverflowContainer>) => (
  <Container>{children}</Container>
)
