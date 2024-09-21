import { ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "../TLayoutBase"
import { TAlign } from "@new/Align/Align"
import { EDirection } from "@new/EDirection"
import { ELayoutDoubleFocus } from "../ELayoutDoubleFocus"
import { TComposition } from "../Composition"

const calculateWidth = (focus: ELayoutDoubleFocus, focusCompare: "left" | "right") => {
  if (focus === ELayoutDoubleFocus.None) {
    return "100%"
  } else if (focus === ELayoutDoubleFocus.Equal) {
    return "50%"
  } else if (focusCompare === "left") {
    if (focus === ELayoutDoubleFocus.Left) {
      return "66.666666%"
    } else {
      return "33.333333%"
    }
  } else {
    if (focus === ELayoutDoubleFocus.Right) {
      return "66.666666%"
    } else {
      return "33.333333%"
    }
  }
}

const Container = styled.div<Pick<TLayoutDoubleBase, "omitPadding" | "direction">>(p => ({
  display: "flex",
  flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
}))

const Left = styled.div<Pick<TLayoutDoubleBase, "focus">>(p => ({
  display: "flex",
  height: "inherit",
  width: calculateWidth(p.focus, "left"),
}))

const Right = styled.div<Pick<TLayoutDoubleBase, "focus">>(p => ({
  display: "flex",
  height: "inherit",
  width: calculateWidth(p.focus, "right"),
}))

export type TLayoutDoubleBase = TLayoutBase & {
  children: [ReactElement<TAlign | TComposition>, ReactElement<TAlign | TComposition>]
  focus: ELayoutDoubleFocus
  direction: EDirection
}

export const LayoutDoubleBase = ({ children, focus, omitPadding, direction, playwrightTestId }: TLayoutDoubleBase) => {
  return (
    <Container
      className="layout-container layout-single"
      direction={direction}
      omitPadding={omitPadding}
      data-playwright-testid={playwrightTestId}
    >
      <Left focus={focus}>{children[0]}</Left>

      <Right focus={focus}>{children[1]}</Right>
    </Container>
  )
}
