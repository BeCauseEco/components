import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EColor, computeColor } from "@new/Color"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  height: "inherit",
})

const ContentStart = styled.div({
  display: "flex",
  position: "relative",
  flexDirection: "row",
  paddingTop: "calc(var(--BU) * 3)",
})

const ContentCloseButton = styled.div({
  display: "flex",
  flexDirection: "row",
})

const ContentTitle = styled.div({
  display: "flex",
  flexDirection: "row",
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "calc(var(--BU) * 3)",
  width: "100%",
})

const ContentMiddle = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  height: "inherit",
  overflow: "hidden",
})

const ContentEnd = styled.div({
  display: "flex",
  flexDirection: "row",
  padding: "calc(var(--BU) * 4)",
  borderTop: `solid 1px ${computeColor([EColor.Black, 100])}`,
  justifyContent: "flex-end",
})

export type TLayoutTakeover = TLayoutBase & {
  contentStart?: ReactNode | ReactNode[]
  contentMiddle: ReactNode | ReactNode[]
  contentEnd: ReactNode | ReactNode[]
  buttonClose: ReactNode
  omitPadding?: boolean
}

export const LayoutTakeover = ({ contentStart, contentMiddle, contentEnd, buttonClose }: TLayoutTakeover) => {
  return (
    <Container className="layout-container">
      <ContentStart>
        <ContentCloseButton>{buttonClose}</ContentCloseButton>

        <ContentTitle>{contentStart}</ContentTitle>
      </ContentStart>

      <ContentMiddle>{contentMiddle}</ContentMiddle>

      <ContentEnd>{contentEnd}</ContentEnd>
    </Container>
  )
}
