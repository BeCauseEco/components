import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "2rem",
})

export type TLayoutDropDownMenu = TLayoutBase & {
  content: ReactNode | ReactNode[]
}

export const LayoutDropDownMenu = ({ content }: TLayoutDropDownMenu) => {
  return <Container className="layout-container">{content}</Container>
}
