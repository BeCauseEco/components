import styled from "@emotion/styled"
import { Color, computeColor } from "@new/Color"
import { ColorWithLightness } from "@new/Color"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { PropsWithChildren, ReactElement } from "react"

type NumberInPixelsOrPercentage = `${number}${"px" | "%"}`
type NumberInVh = `${number}${"vh"}`

type NumberInPixelsOrPercentageBaseUnitFactor = `calc(${number}${"px" | "%"} - var(--BU) * ${number})`

export type OverflowContainerProps = ComponentBaseProps & {
  axes: "vertical" | "horizontal" | "both"
  colorBackground: ColorWithLightness
  colorForeground: Color

  minWidth?: NumberInPixelsOrPercentage | "radix-popover-trigger-width"
  minHeight?: NumberInPixelsOrPercentage

  maxWidth?:
    | NumberInPixelsOrPercentage
    | NumberInPixelsOrPercentageBaseUnitFactor
    | "radix-popover-trigger-width"
    | "radix-popover-content-available-width"

  maxHeight?:
    | "auto"
    | "radix-accordion-content-height"
    | "radix-popover-content-available-height"
    | "radix-popover-content-available-height-SAFE-AREA-INPUTTEXT"
    | NumberInVh
    | NumberInPixelsOrPercentage
    | NumberInPixelsOrPercentageBaseUnitFactor

  hug?: boolean | "partly"
  children: ReactElement | ReactElement[]
}

const computeMaxHeight = (maxHeight: OverflowContainerProps["maxHeight"]): string => {
  if (maxHeight?.endsWith("px") || maxHeight?.endsWith("vh")) {
    return maxHeight
  }

  switch (maxHeight) {
    case "auto":
    default:
      return "auto"

    case "radix-accordion-content-height":
      return "var(--radix-accordion-content-height)"

    case "radix-popover-content-available-height":
      return "var(--radix-popover-content-available-height)"

    case "radix-popover-content-available-height-SAFE-AREA-INPUTTEXT":
      return "calc(var(--radix-popover-content-available-height) - var(--BU) * 24)"
  }
}

const computeMinWidth = (minWidth: OverflowContainerProps["minWidth"]): string => {
  if (minWidth?.endsWith("px")) {
    return minWidth
  }

  switch (minWidth) {
    default:
      return "auto"

    case "radix-popover-trigger-width":
      return "calc(var(--radix-popover-trigger-width) - var(--BU) * 4)"
  }
}

const computeMaxWidth = (maxWidth: OverflowContainerProps["maxWidth"]): string => {
  if (maxWidth?.endsWith("px")) {
    return maxWidth
  }

  switch (maxWidth) {
    default:
      return "auto"

    case "radix-popover-trigger-width":
      return "calc(var(--radix-popover-trigger-width) - var(--BU) * 4)"

    case "radix-popover-content-available-width":
      return "calc(var(--radix-popover-content-available-width) - var(--BU) * 4)"
  }
}

const Container = styled.div<
  Pick<
    OverflowContainerProps,
    "axes" | "colorBackground" | "colorForeground" | "minWidth" | "maxWidth" | "minHeight" | "maxHeight" | "hug"
  >
>(p => ({
  // position: "relative",
  display: "flex",
  flexDirection: "inherit",
  width: "100%",
  height: "inherit",
  padding: p.hug ? (p.hug === "partly" ? "calc(var(--BU) * 2)" : 0) : "calc(var(--BU) * 4)",

  ...(p.minWidth !== undefined && { minWidth: computeMinWidth(p.minWidth) }),
  ...(p.maxWidth !== undefined && { maxWidth: computeMaxWidth(p.maxWidth) }),
  ...(p.minHeight && { minHeight: p.minHeight }),
  ...(p.maxHeight !== undefined && { maxHeight: computeMaxHeight(p.maxHeight) }),

  overflowX: p.axes === "both" || p.axes === "horizontal" ? "auto" : "hidden",
  overflowY: p.axes === "both" || p.axes === "vertical" ? "auto" : "hidden",

  // "&:before, &:after": {
  //   content: `""`,
  //   position: "absolute",
  //   top: 0,
  //   left: "calc(100% - var(--BU) * 4)",
  //   height: "100%",
  //   width: "calc(var(--BU) * 2)",
  //   zIndex: 1,
  //   backgroundImage: `linear-gradient(to right, transparent, ${computeColor(p.colorBackground)})`,
  // },

  // "&:before": {
  //   right: "auto",
  //   left: 0,
  //   backgroundImage: `linear-gradient(to left, transparent, ${computeColor(p.colorBackground)})`,
  // },

  "&::-webkit-scrollbar-track": {
    backgroundColor: computeColor(p.colorBackground),
  },

  "&::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    border: `5px solid ${computeColor(p.colorBackground)}`,
    backgroundColor: computeColor([p.colorForeground, 500]),
  },

  "&:hover::-webkit-scrollbar-thumb": {
    borderRadius: "11px",
    border: `4px solid ${computeColor(p.colorBackground)}`,
    backgroundColor: computeColor([p.colorForeground, 600]),
    borderColor: computeColor(p.colorBackground),
  },
}))

export const OverflowContainer = (p: PropsWithChildren<OverflowContainerProps>) => (
  <Container
    className={`<OverflowContainer /> -${p.className || ""}`}
    axes={p.axes}
    colorBackground={p.colorBackground}
    colorForeground={p.colorForeground}
    minWidth={p.minWidth}
    maxWidth={p.maxWidth}
    minHeight={p.minHeight}
    maxHeight={p.maxHeight}
    hug={p.hug}
    data-playwright-testid={p["data-playwright-testid"]}
  >
    {p.children}
  </Container>
)
