import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { AlignProps } from "@new/Stack/Align"
import { computeColor, Color, ColorWithLightness } from "@new/Color"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { Loader } from "./internal/Loader"
import { Spinner } from "./internal/Spinner"
import { GridProps } from "@new/Grid/Grid"
import { SpacerProps } from "@new/Stack/Spacer"
import { translateBorderRadius } from "./internal/Functions"
import { generateErrorClassName, generateErrorStyles, useValidateChildren } from "@new/useValidateChildren"

export type StackProps = ComponentBaseProps & {
  loading?: boolean
  disabled?: boolean

  /**
   * Only one of "vertical" or "horizontal" can be true
   */
  vertical?: boolean
  horizontal?: boolean

  fill?: ColorWithLightness
  fillHover?: ColorWithLightness
  stroke?: ColorWithLightness
  strokeHover?: ColorWithLightness
  fillLoading?: ColorWithLightness
  dropShadow?: "small" | "medium" | "large"

  cornerRadius?: "small" | "medium" | "large"

  hug?: boolean | "partly"

  /**
   * WARNING: internal properties - only to be used within /components
   */
  explodeHeight?: boolean
  /**
   * WARNING: internal property - only to be used within /components
   */
  overflowHidden?: boolean
  /**
   * WARNING: internal property - only to be used within /components
   */
  aspectRatio?: "auto" | "1"

  children:
    | ReactElement<AlignProps | SpacerProps | null>
    | ReactElement<AlignProps | SpacerProps | null>[]
    | ReactElement<GridProps | null>
}

const computeShadow = (shadow?: StackProps["dropShadow"]): string => {
  switch (shadow) {
    case "small":
      return "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
    case "medium":
      return "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
    case "large":
      return "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)"
    default:
      return "none"
  }
}

type ContainerProps = Pick<
  StackProps,
  | "explodeHeight"
  | "overflowHidden"
  | "cornerRadius"
  | "fill"
  | "fillHover"
  | "stroke"
  | "strokeHover"
  | "dropShadow"
  | "aspectRatio"
  | "validateChildrenErrorStyles"
  | "data-playwright-testid"
>

const Container = styled.div<ContainerProps>(p => ({
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
  boxShadow: computeShadow(p.dropShadow),

  ...(p.stroke && {
    outline: `solid 1px ${computeColor(p.stroke || [Color.Transparent])}`,
  }),

  "&:hover": {
    ...(p.fillHover && { backgroundColor: computeColor(p.fillHover || [Color.Transparent]) }),

    ...(p.strokeHover && {
      outlineColor: computeColor(p.strokeHover || [Color.Transparent]),
    }),
  },

  ...p.validateChildrenErrorStyles,
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
    overflow: "inherit",

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

export const Stack = (p: StackProps) => {
  const [invalidChildren] = useValidateChildren("Stack", ["Align", "Spacer", "Grid", "Divider"], ["Stack"], p.children)

  return (
    <Container
      className={p.className || `<Stack />${generateErrorClassName(invalidChildren)} `}
      data-playwright-testid={p["data-playwright-testid"]}
      fill={p.fill}
      fillHover={p.fillHover}
      stroke={p.stroke}
      strokeHover={p.strokeHover}
      dropShadow={p.dropShadow}
      explodeHeight={p.explodeHeight}
      overflowHidden={p.overflowHidden}
      cornerRadius={p.cornerRadius}
      aspectRatio={p.aspectRatio}
      validateChildrenErrorStyles={generateErrorStyles(invalidChildren)}
    >
      {p.loading !== undefined ? (
        <Loader className="<Stack: loader /> " loading={p.loading ? true : undefined}>
          <Spinner fillLoading={p.fillLoading} loading={p.loading ? true : undefined} />
        </Loader>
      ) : (
        <></>
      )}

      <Children
        className="<Stack: children /> "
        flexDirection={p["horizontal"] && !p["vertical"] ? "row" : "column"}
        hug={p.hug}
        disabled={p.disabled ? true : undefined}
        loading={p.loading ? true : undefined}
      >
        {p.children}
      </Children>
    </Container>
  )
}
