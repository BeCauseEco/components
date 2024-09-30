import styled from "@emotion/styled"
import { ESize } from "@new/ESize"
import { forwardRef, PropsWithChildren, ReactNode } from "react"
import { Spacer } from "@new/Spacer/Spacer"
import { EDirection } from "@new/EDirection"
import { EDistribution } from "@new/EDistrubution"
import { TPlaywright } from "@new/TPlaywright"

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

export type TKeyValuePair = TPlaywright & {
  direction: EDirection
  spacing: ESize
  children: [ReactNode | null | undefined, ReactNode | null | undefined]
  itemDistribution?: EDistribution
}

export const KeyValuePair = forwardRef<HTMLDivElement, PropsWithChildren<TKeyValuePair>>((props, ref) => {
  const { spacing, children, playwrightTestId } = props

  return (
    <Container ref={ref} data-playwright-testid={playwrightTestId} {...props}>
      <Content>{children[0]}</Content>

      {children[0] && <Spacer size={spacing} />}

      <Content>{children[1]}</Content>
    </Container>
  )
})
