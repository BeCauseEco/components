import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 2)",
  maxHeight: "var(--radix-popover-content-available-height)",
  overflowY: "auto",
})

const Top = styled.div({
  display: "flex",
  flexDirection: "column",
})

const Bottom = styled.div({
  display: "flex",
  flexDirection: "column",
  maxHeight: "var(--radix-popover-content-available-height)",

  overflowY: "auto",
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

export type TLayoutCombobox = TLayoutBase & {
  contentTop: ReactNode | ReactNode[]
  contentBottom: ReactNode | ReactNode[]
}

export const LayoutCombobox = ({ contentTop, contentBottom }: TLayoutCombobox) => {
  return (
    <Container className="layout-container">
      <Top>{contentTop}</Top>

      <Bottom>{contentBottom}</Bottom>
    </Container>
  )
}
