import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EDirection } from "@new/EDirection"
import { Size } from "@new/Size"
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
  spacing?: Size
}

export const LayoutThirds = (p: TLayoutThirds) => {
  return (
    <Container
      omitPadding={p.omitPadding}
      spacing={p.spacing}
      direction={p.direction}
      data-playwright-testid={p["data-playwright-testid"]}
    >
      <Content direction={p.direction} className="layout-container">
        {p.contentStart}
      </Content>

      <Content direction={p.direction} className="layout-container">
        {p.contentMiddle}
      </Content>

      <Content direction={p.direction} className="layout-container">
        {p.contentEnd}
      </Content>
    </Container>
  )
}
