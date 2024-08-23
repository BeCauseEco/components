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
