import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EColor, TColor, computeColor } from "@new/Color"
import { ESize } from "@new/ESize"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
})

const ContentTop = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "4rem",
  paddingBottom: 0,
})

const ContentMiddle = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "4rem",
})

type TContentEndProperties = {
  baseColor: EColor
  colorBackground: TColor
  colorBorderTop: TColor
}

const ContentEnd = styled.div<TContentEndProperties>(p => ({
  display: "flex",
  flexDirection: "row",
  padding: "4rem",
  backgroundColor: computeColor(p.colorBackground),
  borderTop:
    p.baseColor === EColor.White
      ? `solid 1px ${computeColor([EColor.Black, 50])} `
      : `solid 1px ${computeColor(p.colorBorderTop)}`,
  borderBottomLeftRadius: ESize.Tiny,
  borderBottomRightRadius: ESize.Tiny,
}))

export type TLayoutDialog = TLayoutBase & {
  colorBackground: EColor
  contentTop: ReactNode | ReactNode[]
  contentMiddle: ReactNode | ReactNode[]
  contentEnd: ReactNode | ReactNode[]
  omitPadding?: boolean
}

export const LayoutAlert = ({ contentTop, contentMiddle, contentEnd, colorBackground }: TLayoutDialog) => {
  return (
    <Container className="layout-container">
      <ContentTop>{contentTop}</ContentTop>

      <ContentMiddle>{contentMiddle}</ContentMiddle>

      <ContentEnd
        baseColor={colorBackground}
        colorBackground={[colorBackground, 100]}
        colorBorderTop={[colorBackground, 300]}
      >
        {contentEnd}
      </ContentEnd>
    </Container>
  )
}
