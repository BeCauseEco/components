import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { TAlign } from "@new/Align/Align"
import { containsIlligalChildren } from "@new/Functions"
import { computeColor, EColor, TColor } from "@new/Color"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { Loader } from "./internal/Loader"
import { Spinner } from "./internal/Spinner"
import { TGrid } from "@new/Grid/Grid"

const translateBorderRadius = (p?: Pick<TStack, "borderRadius">): string => {
  switch (p?.borderRadius) {
    case "small":
      return "calc(var(--BU) / 2)"

    case "medium":
      return "calc(var(--BU) * 1)"

    case "large":
      return "calc(var(--BU) * 1.5)"

    default:
      return "0"
  }
}

const Container = styled.div<
  Pick<
    TStack,
    | "explodeHeight"
    | "overflowHidden"
    | "borderRadius"
    | "colorBackground"
    | "colorBackgroundHover"
    | "colorOutline"
    | "colorOutlineHover"
    | "aspectRatio"
  >
>(p => ({
  display: "flex",
  width: "100%",
  height: p.explodeHeight ? "100%" : "inherit",
  overflow: p.overflowHidden ? "hidden" : "visible",
  cursor: "inherit",
  position: "relative",
  borderRadius: translateBorderRadius({ borderRadius: p.borderRadius }),
  backgroundColor: computeColor(p.colorBackground || [EColor.Transparent]),
  transition: "background-color 0.1s ease-in-out",
  willChange: "background-color",

  ...(p.aspectRatio && {
    aspectRatio: p.aspectRatio,
  }),

  outlineOffset: -1,

  ...(p.colorOutline && {
    outline: `solid 1px ${computeColor(p.colorOutline || [EColor.Transparent])}`,
  }),

  "&:hover": {
    ...(p.colorBackgroundHover && { backgroundColor: computeColor(p.colorBackgroundHover || [EColor.Transparent]) }),

    ...(p.colorOutlineHover && {
      outlineColor: computeColor(p.colorOutlineHover || [EColor.Transparent]),
    }),
  },
}))

const Children = styled.div<Pick<TStack, "loading" | "disabled" | "hug"> & { flexDirection: "column" | "row" }>(p => ({
  display: "inherit",
  flexDirection: p.flexDirection,
  width: "inherit",
  height: "inherit",
  padding: p.hug ? (p.hug === "partly" ? "calc(var(--BU) * 2)" : 0) : "calc(var(--BU) * 4)",
  transition: "opacity 0.2s ease-in-out",
  willChange: "opacity",

  ...(p.loading
    ? {
        // minHeight: "fit-content", TO-DO: @cllpse: perhaps this will break things like text
        height: "unset",
        maxHeight: "calc(var(--BU) * 40)",
        opacity: 0,
        overflow: "hidden",
        cursor: "wait",

        "& *": {
          pointerEvents: "none",
        },
      }
    : {}),

  ...(!p.loading && p.disabled
    ? {
        opacity: 0.6,
        cursor: "not-allowed",

        "& *": {
          pointerEvents: "none",
        },
      }
    : {}),
}))

export type TStack = TLayoutBase & {
  vertical?: boolean
  horizontal?: boolean

  loading?: boolean
  disabled?: boolean

  colorBackground?: TColor
  colorBackgroundHover?: TColor
  colorOutline?: TColor
  colorOutlineHover?: TColor
  colorLoading?: TColor

  borderRadius?: "small" | "medium" | "large"

  hug?: boolean | "partly"
  explodeHeight?: boolean
  overflowHidden?: boolean

  aspectRatio?: "auto" | "1"

  children: ReactElement<TAlign | null> | ReactElement<TGrid | null> | ReactElement<TAlign | null>[]
}

export const Stack = (p: TStack) => {
  if (containsIlligalChildren(p.children, ["Align"])) {
    return <pre>TStack only accepts children of type: TAlign</pre>
  }

  return (
    <Container
      data-playwright-testid={p.playwrightTestId}
      className="layout-container"
      colorBackground={p.colorBackground}
      colorBackgroundHover={p.colorBackgroundHover}
      colorOutline={p.colorOutline}
      colorOutlineHover={p.colorOutlineHover}
      explodeHeight={p.explodeHeight}
      overflowHidden={p.overflowHidden}
      borderRadius={p.borderRadius}
      aspectRatio={p.aspectRatio}
    >
      <Loader loading={p.loading}>
        <Spinner colorLoading={p.colorLoading} loading={p.loading} />
      </Loader>

      <Children
        flexDirection={p["horizontal"] && !p["vertical"] ? "row" : "column"}
        hug={p.hug}
        disabled={p.disabled}
        loading={p.loading}
      >
        {p.children}
      </Children>
    </Container>
  )
}
