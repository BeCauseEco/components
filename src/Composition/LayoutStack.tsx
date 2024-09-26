import { PropsWithChildren, ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "./TLayoutBase"
// import { EDirection } from "@new/EDirection"
import { TAlign } from "@new/Align/Align"
import { EDirection } from "@new/EDirection"

const Container = styled.div<Pick<TLayoutStack, "omitPadding"> & { direction: EDirection }>(p => ({
  display: "flex",
  // flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
}))

type TLayoutStackOptions =
  | {
      vertical: true
    }
  | {
      horizontal: true
    }

export type TLayoutStack = TLayoutBase &
  TLayoutStackOptions & {
    children: ReactElement<TAlign> | ReactElement<TAlign>[]
    omitPadding?: boolean
  }

export const LayoutStack = (props: PropsWithChildren<TLayoutStack>) => {
  let direction = EDirection.Vertical

  console.log("ffs", props)

  if (props["vertical"] && !props["horizontal"]) {
    direction = EDirection.Horizontal
  }

  if (props["horizontal"] && !props["vertical"]) {
    direction = EDirection.Horizontal
  }

  return (
    <Container
      className="layout-container layout-single"
      direction={direction}
      omitPadding={props.omitPadding}
      data-playwright-testid={props.playwrightTestId}
    >
      {props.children}
    </Container>
  )
}
