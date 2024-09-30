import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EDirection } from "@new/EDirection"
import { TLayoutBase } from "./TLayoutBase"

type TContainerProperties = Omit<TLayoutSingle, "content">

const Container = styled.div<TContainerProperties>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
  height: "inherit",
}))

export type TLayoutSingle = TLayoutBase & {
  content: ReactNode | ReactNode[]
  direction: EDirection
  omitPadding?: boolean
}

export const LayoutSingle = ({ content, omitPadding, direction, playwrightTestId }: TLayoutSingle) => {
  return (
    <Container
      omitPadding={omitPadding}
      direction={direction}
      className="layout-container"
      data-playwright-testid={playwrightTestId}
    >
      {content}
    </Container>
  )
}
