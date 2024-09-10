import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EColor, computeColor } from "@new/Color"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  height: "100%",
})

const ContentStart = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "calc(var(--BU) * 4)",
  borderBottom: `solid 1px ${computeColor([EColor.Black, 100])}`,
})

const ContentStartContent = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
})

const ContentMiddle = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  flexGrow: 1,
})

const ContentEnd = styled.div({
  display: "flex",
  flexDirection: "row",
  padding: "calc(var(--BU) * 4)",
  borderTop: `solid 1px ${computeColor([EColor.Black, 100])}`,
  justifyContent: "flex-end",
})

export type TLayoutDialog = TLayoutBase & {
  contentStart?: ReactNode | ReactNode[]
  contentMiddle: ReactNode | ReactNode[]
  contentEnd: ReactNode | ReactNode[]
  buttonClose: ReactNode
  omitPadding?: boolean
}

export const LayoutDialog = ({ contentStart, contentMiddle, contentEnd, buttonClose }: TLayoutDialog) => {
  return (
    <Container className="layout-container">
      <ContentStart>
        <ContentStartContent>{contentStart}</ContentStartContent>

        <ContentStartContent>{buttonClose}</ContentStartContent>
      </ContentStart>

      <ContentMiddle>{contentMiddle}</ContentMiddle>

      <ContentEnd>{contentEnd}</ContentEnd>
    </Container>
  )
}
