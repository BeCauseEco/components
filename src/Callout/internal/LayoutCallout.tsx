import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { ReactNode } from "react"

const Container = styled.div({
  display: "flex",
  padding: "calc(var(--BU) * 3)",
})

export type TLayoutCallout = TLayoutBase & {
  content: ReactNode
}

export const LayoutCallout = ({ content }: TLayoutCallout) => {
  return <Container className="layout-container">{content}</Container>
}
