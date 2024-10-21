import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { TAlign } from "@new/Aligned/Align/Align"
import { containsIlligalChildren } from "@new/Functions"
import { computeColor, EColor, TColor } from "@new/Color"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { ESize } from "@new/ESize"
import { Loader } from "./internal/Loader"
import { Spinner } from "./internal/Spinner"

const translateBorderRadius = (size?: ESize): string => {
  switch (size) {
    case ESize.Small:
      return "var(--BU)"

    case ESize.Medium:
      return "calc(var(--BU) * 1.5)"

    case ESize.Large:
      return "calc(var(--BU) * 2)"

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
  >
>(p => ({
  display: "flex",
  width: "100%",
  height: p.explodeHeight ? "100%" : "inherit",
  overflow: p.overflowHidden ? "hidden" : "visible",
  cursor: "inherit",
  position: "relative",
  borderRadius: translateBorderRadius(p.borderRadius),
  backgroundColor: computeColor(p.colorBackground || [EColor.Transparent]),
  outline: `solid 1px ${computeColor(p.colorOutline || [EColor.Transparent])}`,

  "&:hover": {
    ...(p.colorBackgroundHover && { backgroundColor: computeColor(p.colorBackgroundHover || [EColor.Transparent]) }),

    ...(p.colorBackgroundHover && {
      outlineColor: computeColor(p.colorBackgroundHover || [EColor.Transparent]),
    }),
  },
}))

const Children = styled.div<Pick<TStack, "loading" | "disabled" | "collapse"> & { flexDirection: any }>(p => ({
  display: "inherit",
  flexDirection: p.flexDirection,
  width: "inherit",
  height: "inherit",
  padding: p.collapse ? 0 : "calc(var(--BU) * 4)",
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

  ...(p.disabled
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
  colorLoading?: EColor

  borderRadius?: ESize.Small | ESize.Medium | ESize.Large

  collapse?: boolean
  explodeHeight?: boolean
  overflowHidden?: boolean

  children: ReactElement<TAlign | null> | ReactElement<TAlign | null>[]
}

export const Stack = (p: TStack) => {
  if (p.children && containsIlligalChildren(p.children, ["Align"])) {
    throw "<Stack /> only acceps children of type: TAlign"
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
    >
      <Loader loading={p.loading}>
        <Spinner colorLoading={p.colorLoading} loading={p.loading} />
      </Loader>

      <Children
        flexDirection={p["horizontal"] && !p["vertical"] ? "row" : "column"}
        collapse={p.collapse}
        disabled={p.disabled}
        loading={p.loading}
      >
        {p.children}
      </Children>
    </Container>
  )
}
