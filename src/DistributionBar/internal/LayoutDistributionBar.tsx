import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  width: "100%",
  height: "10px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #ddd",
})

export type TLayoutDistributionBar = TLayoutBase & {
  content: ReactNode | ReactNode[]
}

export const LayoutDistributionBar = ({ content }: TLayoutDistributionBar) => {
  return <Container className="layout-container">{content}</Container>
}
