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
}))

const ContentStart = styled.div<Pick<TLayoutSplit, "direction" | "contentStartWidth">>(p => ({
  display: "flex",
  flexDirection: "column",
  width: p.direction === EDirection.Horizontal ? p.contentStartWidth ?? "50%" : "100%",
}))

const ContentEnd = styled.div<Pick<TLayoutSplit, "direction" | "contentEndWidth">>(p => ({
  display: "flex",
  flexDirection: "column",
  width: p.direction === EDirection.Horizontal ? p.contentEndWidth ?? "50%" : "100%",
}))

export type TLayoutSplit = TLayoutBase & {
  contentStart: ReactNode | ReactNode[]
  contentEnd: ReactNode | ReactNode[]
  direction: EDirection
  omitPadding?: boolean
  spacing?: ESize
  contentStartWidth?: string
  contentEndWidth?: string
}

export const LayoutSplit = ({
  contentStart = null,
  contentEnd = null,
  direction,
  omitPadding = false,
  spacing,
  contentStartWidth,
  contentEndWidth,
}: TLayoutSplit) => {
  return (
    <Container omitPadding={omitPadding} direction={direction} spacing={spacing}>
      <ContentStart className="layout-container" direction={direction} contentStartWidth={contentStartWidth}>
        {contentStart}
      </ContentStart>

      <ContentEnd className="layout-container" direction={direction} contentEndWidth={contentEndWidth}>
        {contentEnd}
      </ContentEnd>
    </Container>
  )
}
