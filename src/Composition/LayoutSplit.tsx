import { ReactElement } from "react"
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
  contentStart: ReactElement | ReactElement[]
  contentEnd: ReactElement | ReactElement[]
  direction: EDirection
  omitPadding?: boolean
  spacing?: ESize
  collapse?: ELayoutSplitCollapse
}

export const LayoutSplit = ({
  contentStart,
  contentEnd,
  direction,
  omitPadding = false,
  spacing,
  collapse,
  playwrightTestId,
}: TLayoutSplit) => {
  return (
    <Container
      omitPadding={omitPadding}
      direction={direction}
      spacing={spacing}
      data-playwright-testid={playwrightTestId}
    >
      <ContentStart className="layout-container" direction={direction} collapse={collapse}>
        {contentStart}
      </ContentStart>

      <ContentEnd className="layout-container" direction={direction} collapse={collapse}>
        {contentEnd}
      </ContentEnd>
    </Container>
  )
}
