import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  padding: "calc(var(--BU) * 1) calc(var(--BU) * 1.5)",
})

export type TLayoutChip = TLayoutBase & {
  content: ReactNode
}

export const LayoutChip = ({ content }: TLayoutChip) => {
  return <Container className="layout-container">{content}</Container>
}
