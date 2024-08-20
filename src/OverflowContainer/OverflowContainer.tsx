import styled from "@emotion/styled"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div<Pick<TOverflowContainer, "maxHeight">>(p => ({
  display: "flex",
  flexDirection: "inherit",
  width: "inherit",
  height: "inherit",
  ...(p.maxHeight && { maxHeight: p.maxHeight }),

  overflowY: "scroll",

  scrollBehavior: "smooth",

  scrollbarWidth: "thin",
  scrollbarColor: "rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 0.1)",

  "&::-webkit-scrollbar": {
    width: "11px",
  },

  "::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "6px",
    border: "3px solid rgba(0, 0, 0, 0.1)",
  },
}))

export type TOverflowContainer = {
  children: ReactElement | ReactElement[]
  maxHeight?: string
}

export const OverflowContainer = ({ children, maxHeight }: PropsWithChildren<TOverflowContainer>) => (
  <Container maxHeight={maxHeight}>{children}</Container>
)
