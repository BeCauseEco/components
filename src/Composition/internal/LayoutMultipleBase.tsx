import { ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "../TLayoutBase"
import { EDirection } from "@new/EDirection"
import { TComposition } from "../Composition"
import { TAlign } from "@new/Align/Align"
import { TSpacer } from "@new/Spacer/Spacer"

const Container = styled.div<Pick<TLayoutMultipleBase, "omitPadding" | "direction">>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
}))

export type TLayoutMultipleBase = TLayoutBase & {
  children: ReactElement<TComposition | TAlign | TSpacer>[]
  direction: EDirection
}

export const LayoutMultipleBase = ({ children, omitPadding, direction, playwrightTestId }: TLayoutMultipleBase) => {
  return (
    <Container
      className="layout-container layout-single"
      direction={direction}
      omitPadding={omitPadding}
      data-playwright-testid={playwrightTestId}
    >
      {children}
    </Container>
  )
}
