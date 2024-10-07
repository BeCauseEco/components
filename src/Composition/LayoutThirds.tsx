import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EDirection } from "@new/EDirection"
import { ESize } from "@new/ESize"
import { TLayoutBase } from "./TLayoutBase"

const Container = styled.div<Pick<TLayoutThirds, "direction" | "omitPadding" | "spacing">>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
  gap: p.spacing || "calc(var(--BU) * 4)",
  height: "inherit",
}))

const Content = styled.div<Pick<TLayoutThirds, "direction">>(p => ({
  display: "flex",
  flexDirection: "column",
  width: p.direction === EDirection.Horizontal ? "33.333%" : "auto",
}))

export type TLayoutThirds = TLayoutBase & {
  contentStart: ReactNode | ReactNode[]
  contentMiddle: ReactNode | ReactNode[]
  contentEnd: ReactNode | ReactNode[]
  direction: EDirection
  omitPadding?: boolean
  spacing?: ESize
}

export const LayoutThirds = ({
  contentStart,
  contentMiddle,
  contentEnd,
  direction = EDirection.Vertical,
  omitPadding = false,
  spacing,
  playwrightTestId,
}: TLayoutThirds) => {
  return (
    <Container
      omitPadding={omitPadding}
      spacing={spacing}
      direction={direction}
      data-playwright-testid={playwrightTestId}
    >
      <Content direction={direction} className="layout-container">
        {contentStart}
      </Content>

      <Content direction={direction} className="layout-container">
        {contentMiddle}
      </Content>

      <Content direction={direction} className="layout-container">
        {contentEnd}
      </Content>
    </Container>
  )
}
