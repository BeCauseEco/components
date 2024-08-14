import styled from "@emotion/styled"
import { ESize } from "@new/ESize"
import { forwardRef, PropsWithChildren, ReactElement } from "react"
import { Spacer } from "@new/Spacer/Spacer"
import { EDirection } from "@new/EDirection"
import { EDistribution } from "@new/EDistrubution"

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

export type TKeyValuePair = {
  direction: EDirection
  spacing: ESize
  children: [ReactElement | null | undefined, ReactElement | null | undefined]
  itemDistribution?: EDistribution
}

export const KeyValuePair = forwardRef<HTMLDivElement, PropsWithChildren<TKeyValuePair>>((props, ref) => {
  const { spacing, children } = props

  return (
    <Container ref={ref} {...props}>
      <Content>{children[0]}</Content>

      {children[0] && <Spacer size={spacing} />}

      <Content>{children[1]}</Content>
    </Container>
  )
})
