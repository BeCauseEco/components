import { PropsWithChildren } from "react"
import styled from "@emotion/styled"
import { ESize } from "@new/ESize"

const computeAlignment = (
  vertical,
  horizontal,
  topLeft,
  topCenter,
  topRight,
  left,
  center,
  right,
  bottomLeft,
  bottomCenter,
  bottomRight,
) => {
  const r = {
    justifyContent: "normal",
    alignItems: "normal",
  }

  if (vertical) {
    if (topLeft) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-start"
    }

    if (topCenter) {
      r.justifyContent = "flex-start"
      r.alignItems = "center"
    }

    if (topRight) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-end"
    }

    if (left) {
      r.justifyContent = "center"
      r.alignItems = "flex-start"
    }

    if (center) {
      r.justifyContent = "center"
      r.alignItems = "center"
    }

    if (right) {
      r.justifyContent = "center"
      r.alignItems = "flex-end"
    }

    if (bottomLeft) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-start"
    }

    if (bottomCenter) {
      r.justifyContent = "flex-end"
      r.alignItems = "center"
    }

    if (bottomRight) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-end"
    }
  } else if (horizontal) {
    if (topLeft) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-start"
    }

    if (topCenter) {
      r.justifyContent = "center"
      r.alignItems = "flex-start"
    }

    if (topRight) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-start"
    }

    if (left) {
      r.justifyContent = "flex-start"
      r.alignItems = "center"
    }

    if (center) {
      r.justifyContent = "center"
      r.alignItems = "center"
    }

    if (right) {
      r.justifyContent = "flex-end"
      r.alignItems = "center"
    }

    if (bottomLeft) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-end"
    }

    if (bottomCenter) {
      r.justifyContent = "center"
      r.alignItems = "flex-end"
    }

    if (bottomRight) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-end"
    }
  }

  return r
}

const Container = styled.div<TAlign>(p => ({
  display: "flex",
  flexWrap: "inherit",
  flexDirection: p["vertical"] ? "column" : "row",
  width: "100%",
  height: "100%",
  ...computeAlignment(
    p["vertical"] || false,
    p["horizontal"] || false,
    p["topLeft"] || false,
    p["topCenter"] || false,
    p["topRight"] || false,
    p["left"] || false,
    p["center"] || false,
    p["right"] || false,
    p["bottomLeft"] || false,
    p["bottomCenter"] || false,
    p["bottomRight"] || false,
  ),
  gap: p.spacing || 0,
}))

type TAlignPositioning =
  | {
      topLeft: true
    }
  | {
      topCenter: true
    }
  | {
      topRight: true
    }
  | {
      left: true
    }
  | {
      center: true
    }
  | {
      right: true
    }
  | {
      bottomLeft: true
    }
  | {
      bottomCenter: true
    }
  | {
      bottomRight: true
    }

export type TAlign =
  | (TAlignPositioning & {
      vertical: true
      spacing?: ESize
    })
  | (TAlignPositioning & {
      horizontal: true
      spacing?: ESize
    })

export const Align = ({
  // @ts-expect-error TypeScript is not smart enough to accept discriminating unions in this case
  topLeft,
  // @ts-expect-error
  topCenter,
  // @ts-expect-error
  topRight,
  // @ts-expect-error
  left,
  // @ts-expect-error
  center,
  // @ts-expect-error
  right,
  // @ts-expect-error
  bottomLeft,
  // @ts-expect-error
  bottomCenter,
  // @ts-expect-error
  bottomRight,
  // @ts-expect-error
  vertical,
  // @ts-expect-error
  horizontal,
  spacing,
  children,
}: PropsWithChildren<TAlign>) => (
  <Container
    topLeft={topLeft}
    topCenter={topCenter}
    topRight={topRight}
    left={left}
    center={center}
    right={right}
    bottomLeft={bottomLeft}
    bottomCenter={bottomCenter}
    bottomRight={bottomRight}
    vertical={vertical}
    horizontal={horizontal}
    spacing={spacing}
  >
    {children}
  </Container>
)
