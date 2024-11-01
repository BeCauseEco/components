import styled from "@emotion/styled"
import { computeColor } from "@new/Color"
import { TColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"

import { PropsWithChildren, ReactElement } from "react"

const Container = styled.div<
  Pick<
    TOverflowContainer,
    "axes" | "colorBackground" | "colorForeground" | "minWidth" | "maxWidth" | "minHeight" | "maxHeight" | "hug"
  >
>(p => ({
  display: "flex",
  flexDirection: "inherit",
  width: "100%",
  height: "inherit",
  padding: p.hug ? 0 : "calc(var(--BU) * 4)",
  ...(p.minWidth && { minWidth: p.minWidth }),
  ...(p.maxWidth && { maxWidth: p.maxWidth }),
  ...(p.minHeight && { minHeight: p.minHeight }),
  ...(p.maxHeight !== undefined && { maxHeight: p.maxHeight }),
  overflowX: p.axes === EOverflowContainerAxis.Both || p.axes === EOverflowContainerAxis.Horizontal ? "auto" : "hidden",
  overflowY: p.axes === EOverflowContainerAxis.Both || p.axes === EOverflowContainerAxis.Vertical ? "auto" : "hidden",

  "::-webkit-scrollbar-track": {
    backgroundColor: computeColor(p.colorBackground),
  },

  "::-webkit-scrollbar-thumb": {
    backgroundColor: computeColor(p.colorForeground),
    borderColor: computeColor(p.colorBackground),
  },
}))

export enum EOverflowContainerAxis {
  Vertical,
  Horizontal,
  Both,
}

export enum EMaxheightOptions {
  RadixAccordionContentHeight = "var(--radix-accordion-content-height)",
  RadixPopoverContentAvailableHeight = "var(--radix-popover-content-available-height)",
}

export type TOverflowContainer = TPlaywright & {
  axes: EOverflowContainerAxis
  colorBackground: TColor
  colorForeground: TColor
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: EMaxheightOptions | string
  hug?: boolean
  children: ReactElement | ReactElement[]
}

export const OverflowContainer = ({
  axes,
  colorBackground,
  colorForeground,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  hug,
  children,
  playwrightTestId,
}: PropsWithChildren<TOverflowContainer>) => (
  <Container
    axes={axes}
    colorBackground={colorBackground}
    colorForeground={colorForeground}
    minWidth={minWidth}
    maxWidth={maxWidth}
    minHeight={minHeight}
    maxHeight={maxHeight}
    hug={hug}
    data-playwright-testid={playwrightTestId}
  >
    {children}
  </Container>
)
