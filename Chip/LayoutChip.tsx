import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  padding: "calc(var(--BU) * 0.5) calc(var(--BU) * 2)",
})

export type TLayoutChip = TLayoutBase & {
  content: ReactNode
}

export const LayoutChip = ({ content }: TLayoutChip) => {
  return <Container className="layout-container">{content}</Container>
}
