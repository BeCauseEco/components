import styled from "@emotion/styled"
import { Size } from "@new/Size"
import { forwardRef, PropsWithChildren, ReactElement } from "react"
import { EDirection } from "@new/EDirection"
import { EDistribution } from "@new/EDistrubution"
import { PlaywrightProps } from "@new/Playwright"

type TConatinerProperties = Pick<TKeyValuePair, "direction" | "itemDistribution">

const Container = styled.div<TConatinerProperties>(p => ({
  display: "flex",
  alignItems: p.direction === EDirection.Horizontal ? "center" : "normal",
  flexDirection: p.direction === EDirection.Horizontal ? "row" : "column",
  justifyContent: p.itemDistribution ? p.itemDistribution : "normal",
  width: "100%",
  pointerEvents: "none",
}))

const Content = styled.div({
  display: "flex",
  height: "100%",
  lineHeight: "inherit",
  alignItems: "center",

  "& *": {
    pointerEvents: "all",
  },
})

export type TKeyValuePair = PlaywrightProps & {
  direction: EDirection
  spacing: Size
  children: [ReactElement | null | undefined, ReactElement | null | undefined]
  itemDistribution?: EDistribution
}

export const KeyValuePair = forwardRef<HTMLDivElement, PropsWithChildren<TKeyValuePair>>((props, ref) => {
  const { spacing, children, playwrightTestId } = props

  return (
    <Container ref={ref} data-playwright-testid={playwrightTestId} {...props}>
      <Content>{children[0]}</Content>

      {/* TO-DO: @cllpse fix Spacer */}
      {children[0] && <div style={{ display: "flex", flexShrink: 0, width: spacing, height: spacing }} />}

      <Content>{children[1]}</Content>
    </Container>
  )
})
