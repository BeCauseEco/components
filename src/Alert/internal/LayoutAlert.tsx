import { ReactNode } from "react"
import styled from "@emotion/styled"
import { Size } from "@new/Size"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { computeColor, Color } from "@new/Color"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
})

const ContentTop = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "calc(var(--BU) * 4)",
  paddingBottom: "calc(var(--BU) * 2)",
  userSelect: "none",
})

const ContentMiddle = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 4)",
  paddingTop: 0,
  userSelect: "none",
})

const ContentEnd = styled.div({
  display: "flex",
  flexDirection: "row",
  padding: "calc(var(--BU) * 4)",
  borderTop: `solid 1px ${computeColor([Color.Neutral, 100])}`,
  borderBottomLeftRadius: Size.Tiny,
  borderBottomRightRadius: Size.Tiny,
  justifyContent: "flex-end",
})

export type TLayoutDialog = TLayoutBase & {
  contentTop: ReactNode | ReactNode[]
  contentMiddle: ReactNode | ReactNode[]
  contentEnd: ReactNode | ReactNode[]
  omitPadding?: boolean
}

export const LayoutAlert = ({ contentTop, contentMiddle, contentEnd }: TLayoutDialog) => {
  return (
    <Container className="layout-container">
      <ContentTop>{contentTop}</ContentTop>

      {contentMiddle && <ContentMiddle>{contentMiddle}</ContentMiddle>}

      <ContentEnd>{contentEnd}</ContentEnd>
    </Container>
  )
}
