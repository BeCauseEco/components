import styled from "@emotion/styled"
import { TPlaywright } from "@new/TPlaywright"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div<Pick<TOverflowContainer, "minHeight" | "maxHeight" | "omitPadding" | "axes">>(p => ({
  display: "flex",
  flexDirection: "inherit",
  width: "100%",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
  ...(p.minHeight && { minHeight: p.minHeight }),
  ...(p.maxHeight && { maxHeight: p.maxHeight }),
  overflowX: p.axes === EOverflowContainerAxis.Both || p.axes === EOverflowContainerAxis.XAxis ? "auto" : "hidden",
  overflowY: p.axes === EOverflowContainerAxis.Both || p.axes === EOverflowContainerAxis.YAxis ? "auto" : "hidden",
  outline: "solid 1px red",
}))

export enum EOverflowContainerAxis {
  YAxis,
  XAxis,
  Both,
}

export enum EMaxheightOptions {
  RadixAccordionContentHeight = "var(--radix-accordion-content-height)",
  RadixPopoverContentAvailableHeight = "var(--radix-popover-content-available-height)",
}

export type TOverflowContainer = TPlaywright & {
  axes: EOverflowContainerAxis
  omitPadding?: boolean
  minHeight?: string
  maxHeight?: EMaxheightOptions | string
  children: ReactElement | ReactElement[]
}

export const OverflowContainer = ({
  axes,
  omitPadding,
  minHeight,
  maxHeight,
  children,
  playwrightTestId,
}: PropsWithChildren<TOverflowContainer>) => (
  <Container
    className="component-overflow_container"
    minHeight={minHeight}
    maxHeight={maxHeight}
    omitPadding={omitPadding}
    axes={axes}
    data-playwright-testid={playwrightTestId}
  >
    {children}
  </Container>
)
