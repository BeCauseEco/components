import styled from "@emotion/styled"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div<Pick<TOverflowContainer, "maxHeight" | "omitPadding">>(p => ({
  display: "flex",
  flexDirection: "inherit",
  width: "100%",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
  ...(p.maxHeight && { maxHeight: p.maxHeight }),
  overflowY: "auto",
}))

export type TOverflowContainer = {
  children: ReactElement | ReactElement[]
  omitPadding?: boolean
  maxHeight?: string
}

export const OverflowContainer = ({ children, omitPadding, maxHeight }: PropsWithChildren<TOverflowContainer>) => (
  <Container maxHeight={maxHeight} omitPadding={omitPadding}>
    {children}
  </Container>
)
