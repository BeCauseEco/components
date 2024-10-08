import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { TAlign } from "@new/Align/Align"
import { TLayoutBase } from "./TLayoutBase"
import { EDirection } from "@new/EDirection"
import { containsIlligalChildren } from "@new/Functions"

const Container = styled.div<Pick<TLayoutStackBase, "omitPadding"> & { direction: EDirection }>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Vertical ? "column" : "row",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
}))

type TLayoutStackBase = TLayoutBase & {
  children: ReactElement<TAlign> | ReactElement<TAlign>[]
}

type TLayoutStackVertical = TLayoutStackBase & {
  vertical: true
}

type TLayoutStackHorizontal = TLayoutStackBase & {
  horizontal: true
}

export type TLayoutStack = TLayoutStackVertical | TLayoutStackHorizontal

export const LayoutStack = (p: TLayoutStack) => {
  if (containsIlligalChildren(p.children, ["Align"])) {
    throw "LayoutStack only acceps children of type TAlign"
  }

  let direction = EDirection.Vertical

  if (p["horizontal"] && !p["vertical"]) {
    direction = EDirection.Horizontal
  }

  return (
    <Container
      className="layout-container layout-single"
      omitPadding={p.omitPadding}
      direction={direction}
      data-playwright-testid={p.playwrightTestId}
    >
      {p.children}
    </Container>
  )
}
