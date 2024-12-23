import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EDirection } from "@new/EDirection"
import { Size } from "@new/Size"
import { TLayoutBase } from "./TLayoutBase"

type TContainerProperties = Pick<TLayoutSplit, "omitPadding" | "direction" | "spacing">

const Container = styled.div<TContainerProperties>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
  gap: p.spacing || "calc(var(--BU) * 4)",
  height: "inherit",
}))

const Content = styled.div<Pick<TLayoutSplit, "direction" | "collapse">>({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
})

const calculateWidth = (element: "start" | "end", direction: EDirection, collapse?: ELayoutSplitCollapse) => {
  let r = direction === EDirection.Vertical ? "100%" : "50%"

  if (direction === EDirection.Horizontal) {
    if (element === collapse) {
      r = "fit-content"
    } else {
      r = "100%"
    }
  }

  return r
}

const ContentStart = styled(Content)(p => ({
  width: calculateWidth("start", p.direction, p.collapse),
}))

const ContentEnd = styled(Content)(p => ({
  width: calculateWidth("end", p.direction, p.collapse),
}))

export enum ELayoutSplitCollapse {
  ContentStart = "start",
  ContentEnd = "end",
}

export type TLayoutSplit = TLayoutBase & {
  contentStart: ReactNode | ReactNode[]
  contentEnd: ReactNode | ReactNode[]
  direction: EDirection
  omitPadding?: boolean
  spacing?: Size
  collapse?: ELayoutSplitCollapse
}

export const LayoutSplit = (p: TLayoutSplit) => {
  return (
    <Container
      omitPadding={p.omitPadding}
      direction={p.direction}
      spacing={p.spacing}
      data-playwright-testid={p["data-playwright-testid"]}
    >
      <ContentStart className="layout-container" direction={p.direction} collapse={p.collapse}>
        {p.contentStart}
      </ContentStart>

      <ContentEnd className="layout-container" direction={p.direction} collapse={p.collapse}>
        {p.contentEnd}
      </ContentEnd>
    </Container>
  )
}
