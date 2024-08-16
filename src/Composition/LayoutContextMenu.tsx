import { ReactNode } from "react"
import styled from "@emotion/styled"
import { EDirection } from "@new/EDirection"
import { TLayoutBase } from "./TLayoutBase"

const Container = styled.div<Omit<TLayoutContextMenu, "content">>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  padding: "calc(var(--BU) * 2)",
  height: "inherit",

  "& > *": {
    width: "100%",
  },
}))

export type TLayoutContextMenu = TLayoutBase & {
  content: ReactNode | ReactNode[]
  direction: EDirection
  omitPadding?: boolean
}

export const LayoutContextMenu = ({ content, direction }: TLayoutContextMenu) => {
  return (
    <Container direction={direction} className="layout-container">
      {content}
    </Container>
  )
}
