import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EDirection } from "@new/EDirection"
import { ESize } from "@new/ESize"
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
  spacing?: ESize
  collapse?: ELayoutSplitCollapse
}

export const LayoutSplit = ({
  contentStart = null,
  contentEnd = null,
  direction,
  omitPadding = false,
  spacing,
  collapse,
}: TLayoutSplit) => {
  return (
    <Container omitPadding={omitPadding} direction={direction} spacing={spacing}>
      <ContentStart className="layout-container" direction={direction} collapse={collapse}>
        {contentStart}
      </ContentStart>

      <ContentEnd className="layout-container" direction={direction} collapse={collapse}>
        {contentEnd}
      </ContentEnd>
    </Container>
  )
}
