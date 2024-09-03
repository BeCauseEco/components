import styled from "@emotion/styled"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div<Pick<TOverflowContainer, "maxHeight" | "omitPadding" | "axes">>(p => ({
  display: "flex",
  flexDirection: "inherit",
  width: "100%",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
  ...(p.maxHeight && { maxHeight: p.maxHeight }),
  overflowX: p.axes === EOverflowContainerAxis.Both || p.axes === EOverflowContainerAxis.XAxis ? "auto" : "hidden",
  overflowY: p.axes === EOverflowContainerAxis.Both || p.axes === EOverflowContainerAxis.YAxis ? "auto" : "hidden",
}))

export enum EOverflowContainerAxis {
  YAxis,
  XAxis,
  Both,
}

export type TOverflowContainer = {
  axes: EOverflowContainerAxis
  omitPadding?: boolean
  maxHeight?: string
  children: ReactElement | ReactElement[]
}

export const OverflowContainer = ({
  axes,
  omitPadding,
  maxHeight,
  children,
}: PropsWithChildren<TOverflowContainer>) => (
  <Container maxHeight={maxHeight} omitPadding={omitPadding} axes={axes}>
    {children}
  </Container>
)
