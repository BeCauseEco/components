import React, { ReactElement } from "react"
import styled from "@emotion/styled"
// import { TLayoutBase } from "./TLayoutBase"
// import { EDirection } from "@new/EDirection"
import { TAlign } from "@new/Align/Align"
import { TLayoutBase } from "./TLayoutBase"
import { EDirection } from "@new/EDirection"
// import { EDirection } from "@new/EDirection"

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

export const LayoutStack = (properties: TLayoutStackVertical | TLayoutStackHorizontal) => {
  let direction = EDirection.Vertical

  if (properties["horizontal"] && !properties["vertical"]) {
    direction = EDirection.Horizontal
  }

  return (
    <Container
      className="layout-container layout-single"
      omitPadding={properties.omitPadding}
      direction={direction}
      data-playwright-testid={properties.playwrightTestId}
    >
      {properties.children}
    </Container>
  )
}
