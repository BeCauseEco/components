import styled from "@emotion/styled"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div({
  display: "flex",
  flexDirection: "inherit",
  width: "inherit",
  height: "inherit",
  outline: "solid 1px cyan",

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
})

export type TOverflowContainer = {
  children: ReactElement | ReactElement[]
}

export const OverflowContainer = ({ children }: PropsWithChildren<TOverflowContainer>) => (
  <Container>{children}</Container>
)
