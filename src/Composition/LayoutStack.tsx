import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { AlignProps } from "@new/Stack/Align"
import { TLayoutBase } from "./TLayoutBase"
import { EDirection } from "@new/EDirection"

const Container = styled.div<Pick<TLayoutStackBase, "omitPadding"> & { direction: EDirection }>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Vertical ? "column" : "row",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
}))

type TLayoutStackBase = TLayoutBase & {
  children: ReactElement<AlignProps> | ReactElement<AlignProps>[]
}

type TLayoutStackVertical = TLayoutStackBase & {
  vertical: true
}

type TLayoutStackHorizontal = TLayoutStackBase & {
  horizontal: true
}

export type TLayoutStack = TLayoutStackVertical | TLayoutStackHorizontal

export const LayoutStack = (p: TLayoutStack) => {
  let direction = EDirection.Vertical

  if (p["horizontal"] && !p["vertical"]) {
    direction = EDirection.Horizontal
  }

  return (
    <Container
      className="layout-container layout-single"
      omitPadding={p.omitPadding}
      direction={direction}
      data-playwright-testid={p["data-playwright-testid"]}
    >
      {p.children}
    </Container>
  )
}
