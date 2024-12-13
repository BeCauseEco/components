import styled from "@emotion/styled"
import { computeColor } from "@new/Color"
import { ColorWithLightness } from "@new/Color"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { PropsWithChildren, ReactElement } from "react"

export type OverflowContainerProps = ComponentBaseProps & {
  axes: "vertical" | "horizontal" | "both"
  colorBackground: ColorWithLightness
  colorForeground: ColorWithLightness

  minWidth?: `${number}${"px" | "%"}`
  maxWidth?: `${number}${"px" | "%"}`
  minHeight?: `${number}${"px" | "%"}`

  maxHeight:
    | "auto"
    | "radix-accordion-content-height"
    | "radix-popover-content-available-height"
    | "radix-popover-content-available-height-SAFE-AREA-INPUTTEXT"
    | `${number}${"px" | "%"}`

  hug?: boolean | "partly"
  children: ReactElement | ReactElement[]
}

const computeMaxHeight = (maxHeight: OverflowContainerProps["maxHeight"]): string => {
  if (maxHeight.endsWith("px")) {
    return maxHeight
  }

  switch (maxHeight) {
    case "auto":
    default:
      return "none"

    case "radix-accordion-content-height":
      return "var(--radix-accordion-content-height)"

    case "radix-popover-content-available-height":
      return "var(--radix-popover-content-available-height)"

    case "radix-popover-content-available-height-SAFE-AREA-INPUTTEXT":
      return "calc(var(--radix-popover-content-available-height) - var(--BU) * 24)"
  }
}

const Container = styled.div<
  Pick<
    OverflowContainerProps,
    "axes" | "colorBackground" | "colorForeground" | "minWidth" | "maxWidth" | "minHeight" | "maxHeight" | "hug"
  >
>(p => ({
  display: "flex",
  flexDirection: "inherit",
  width: "100%",
  height: "inherit",
  padding: p.hug ? (p.hug === "partly" ? "calc(var(--BU) * 2)" : 0) : "calc(var(--BU) * 4)",

  ...(p.minWidth && { minWidth: p.minWidth }),
  ...(p.maxWidth && { maxWidth: p.maxWidth }),
  ...(p.minHeight && { minHeight: p.minHeight }),
  ...(p.maxHeight !== undefined && { maxHeight: computeMaxHeight(p.maxHeight) }),

  overflowX: p.axes === "both" || p.axes === "horizontal" ? "auto" : "hidden",
  overflowY: p.axes === "both" || p.axes === "vertical" ? "auto" : "hidden",

  "::-webkit-scrollbar-track": {
    backgroundColor: computeColor(p.colorBackground),
  },

  "::-webkit-scrollbar-thumb": {
    backgroundColor: computeColor(p.colorForeground),
    borderColor: computeColor(p.colorBackground),
  },
}))

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
  className,
}: PropsWithChildren<OverflowContainerProps>) => (
  <Container
    className={`<OverflowContainer /> -${className || ""}`}
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
