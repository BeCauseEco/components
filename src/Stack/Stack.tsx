import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { AlignProps } from "@new/Stack/Align"
// import { containsIlligalChildren } from "@new/Functions"
import { computeColor, Color, ColorWithLightness } from "@new/Color"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { Loader } from "./internal/Loader"
import { Spinner } from "./internal/Spinner"
import { GridProps } from "@new/Grid/Grid"
import { SpacerProps } from "@new/Stack/Spacer"
import { translateBorderRadius } from "./internal/Functions"

const Container = styled.div<
  Pick<
    StackProps,
    | "explodeHeight"
    | "overflowHidden"
    | "cornerRadius"
    | "fill"
    | "fillHover"
    | "stroke"
    | "strokeHover"
    | "aspectRatio"
  >
>(p => ({
  display: "flex",
  flexShrink: 1,
  width: "100%",
  height: p.explodeHeight ? "100%" : "auto",
  overflow: p.overflowHidden ? "hidden" : "visible",
  cursor: "inherit",
  position: "relative",
  borderRadius: translateBorderRadius(p.cornerRadius),
  backgroundColor: computeColor(p.fill || [Color.Transparent]),
  transition: "background-color 0.1s ease-in-out",
  willChange: "background-color",
  aspectRatio: p.aspectRatio || "auto",
  content: `'${p.aspectRatio}'`,

  outlineOffset: -1,

  ...(p.stroke && {
    outline: `solid 1px ${computeColor(p.stroke || [Color.Transparent])}`,
  }),

  "&:hover": {
    ...(p.fillHover && { backgroundColor: computeColor(p.fillHover || [Color.Transparent]) }),

    ...(p.strokeHover && {
      outlineColor: computeColor(p.strokeHover || [Color.Transparent]),
    }),
  },
}))

const Children = styled.div<Pick<StackProps, "loading" | "disabled" | "hug"> & { flexDirection: "column" | "row" }>(
  p => ({
    display: "inherit",
    flexDirection: p.flexDirection,
    width: "inherit",
    height: "inherit",
    padding: p.hug ? (p.hug === "partly" ? "calc(var(--BU) * 2)" : 0) : "calc(var(--BU) * 4)",
    transition: "opacity 0.2s ease-in-out",
    willChange: "opacity",

    ...(p.loading
      ? {
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
  }),
)

type StackBaseProps = ComponentBaseProps & {
  loading?: boolean
  disabled?: boolean

  fill?: ColorWithLightness
  fillHover?: ColorWithLightness
  stroke?: ColorWithLightness
  strokeHover?: ColorWithLightness
  colorLoading?: ColorWithLightness

  cornerRadius?: "small" | "medium" | "large"

  hug?: boolean | "partly"

  /**
   * INTERNAL PROPERTY
   */
  explodeHeight?: boolean

  /**
   * INTERNAL PROPERTY
   */
  overflowHidden?: boolean

  /**
   * INTERNAL PROPERTY
   * Only used in combination with InputButtonIcon
   */
  aspectRatio?: "auto" | "1"

  children:
    | ReactElement<AlignProps | SpacerProps | null>
    | ReactElement<AlignProps | SpacerProps | null>[]
    | ReactElement<GridProps | null>
}

type StackVerticalProps = StackBaseProps & {
  /**
   * Only one of "vertical" or "horizontal" can be true
   */
  vertical: boolean
}

type StackHorizontalProps = StackBaseProps & {
  /**
   * Only one of "vertical" or "horizontal" can be true
   */
  horizontal: boolean
}

export type StackProps = StackVerticalProps | StackHorizontalProps

export const Stack = (p: StackProps) => {
  // if (containsIlligalChildren(p.children, ["Align"])) {
  //   return <pre>TStack only accepts children of type: TAlign</pre>
  // }

  return (
    <Container
      className={p.className || "<Stack /> -"}
      data-playwright-testid={p.playwrightTestId}
      fill={p.fill}
      fillHover={p.fillHover}
      stroke={p.stroke}
      strokeHover={p.strokeHover}
      explodeHeight={p.explodeHeight}
      overflowHidden={p.overflowHidden}
      cornerRadius={p.cornerRadius}
      aspectRatio={p.aspectRatio}
    >
      <Loader className="<Stack: loader />" loading={p.loading}>
        <Spinner colorLoading={p.colorLoading} loading={p.loading} />
      </Loader>

      <Children
        className="<Stack: children />"
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
