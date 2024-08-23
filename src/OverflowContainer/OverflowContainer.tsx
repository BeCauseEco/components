import styled from "@emotion/styled"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div<Pick<TOverflowContainer, "maxHeight">>(p => ({
  display: "flex",
  flexDirection: "inherit",
  width: "100%",
  height: "inherit",
  ...(p.maxHeight && { maxHeight: p.maxHeight }),
  overflowY: "scroll",
}))

export type TOverflowContainer = {
  children: ReactElement | ReactElement[]
  maxHeight?: string
}

export const OverflowContainer = ({ children, maxHeight }: PropsWithChildren<TOverflowContainer>) => (
  <Container maxHeight={maxHeight}>{children}</Container>
)
