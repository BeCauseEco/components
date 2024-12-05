import { PropsWithChildren } from "react"
import styled from "@emotion/styled"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { computeAlignment, computeWidthHeight } from "./internal/Functions"

const Container = styled.div<AlignProps>(p => ({
  display: "flex",
  flexWrap: p["wrap"] ? "wrap" : "nowrap",
  flexDirection: p["vertical"] ? "column" : "row",
  padding: 0,
  margin: 0,

  ...(p["wrap"] && {
    gap: "calc(var(--BU) * 4)",
  }),

  ...computeWidthHeight(p),
  ...computeAlignment(p),
}))

type AlignBaseProps = ComponentBaseProps & {
  hug?: boolean | "width" | "height"
}

type AlignVerticalProps = AlignBaseProps & {
  /**
   * Only one of "vertical" or "horizontal" or "wrap" can be true
   */
  vertical: boolean
}

type AlignHorizontalProps = AlignBaseProps & {
  /**
   * Only one of "vertical" or "horizontal" or "wrap" can be true
   */
  horizontal: boolean
}

type AlignWrapProps = AlignBaseProps & {
  /**
   * Only one of "vertical" or "horizontal" or "wrap" can be true
   */
  wrap: boolean
}

type AlignTopLeftProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  topLeft: boolean
}

type AlignTopCenterProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  topCenter: boolean
}

type AlignTopRightProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  topRight: boolean
}

type AlignLeftProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  left: boolean
}

type AlignCenterProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  center: boolean
}

type AlignRightProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  right: boolean
}

type AlignBottomLeftProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  bottomLeft: boolean
}

type AlignBottomCenterProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  bottomCenter: boolean
}

type AlignBottomRightProps = AlignBaseProps & {
  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
  bottomRight: boolean
}

export type AlignProps =
  | AlignVerticalProps
  | AlignHorizontalProps
  | AlignWrapProps
  | AlignTopLeftProps
  | AlignTopCenterProps
  | AlignTopRightProps
  | AlignLeftProps
  | AlignCenterProps
  | AlignRightProps
  | AlignBottomLeftProps
  | AlignBottomCenterProps
  | AlignBottomRightProps

export const Align = (p: PropsWithChildren<AlignProps>) => (
  <Container
    className={`<Align /> -`}
    vertical={p["vertical"]}
    horizontal={p["horizontal"]}
    wrap={p["wrap"]}
    topLeft={p["topLeft"]}
    topCenter={p["topCenter"]}
    topRight={p["topRight"]}
    left={p["left"]}
    center={p["center"]}
    right={p["right"]}
    bottomLeft={p["bottomLeft"]}
    bottomCenter={p["bottomCenter"]}
    bottomRight={p["bottomRight"]}
    hug={p.hug}
  >
    {p.children}
  </Container>
)
