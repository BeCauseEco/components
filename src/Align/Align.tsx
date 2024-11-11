import { PropsWithChildren } from "react"
import styled from "@emotion/styled"

const computeAlignment = (p: Omit<AlignProps, "spacing" | "hug">) => {
  const r = {
    justifyContent: "",
    alignItems: "",
  }

  if (p.vertical) {
    if (p.topLeft) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-start"
    }

    if (p.topCenter) {
      r.justifyContent = "flex-start"
      r.alignItems = "center"
    }

    if (p.topRight) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-end"
    }

    if (p.left) {
      r.justifyContent = "center"
      r.alignItems = "flex-start"
    }

    if (p.center) {
      r.justifyContent = "center"
      r.alignItems = "center"
    }

    if (p.right) {
      r.justifyContent = "center"
      r.alignItems = "flex-end"
    }

    if (p.bottomLeft) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-start"
    }

    if (p.bottomCenter) {
      r.justifyContent = "flex-end"
      r.alignItems = "center"
    }

    if (p.bottomRight) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-end"
    }
  } else if (p.horizontal) {
    if (p.topLeft) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-start"
    }

    if (p.topCenter) {
      r.justifyContent = "center"
      r.alignItems = "flex-start"
    }

    if (p.topRight) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-start"
    }

    if (p.left) {
      r.justifyContent = "flex-start"
      r.alignItems = "center"
    }

    if (p.center) {
      r.justifyContent = "center"
      r.alignItems = "center"
    }

    if (p.right) {
      r.justifyContent = "flex-end"
      r.alignItems = "center"
    }

    if (p.bottomLeft) {
      r.justifyContent = "flex-start"
      r.alignItems = "flex-end"
    }

    if (p.bottomCenter) {
      r.justifyContent = "center"
      r.alignItems = "flex-end"
    }

    if (p.bottomRight) {
      r.justifyContent = "flex-end"
      r.alignItems = "flex-end"
    }
  }

  return r
}

const computeWidthHeight = (p: AlignProps) => {
  let width = "100%"
  let height = "100%"

  if (p.hug === true) {
    width = "fit-content"
    height = "fit-content"
  } else if (p.hug === "width") {
    width = "fit-content"
  } else if (p.hug === "height") {
    height = "fit-content"
  }

  return { width, height }
}

const Container = styled.div<AlignProps>(p => ({
  display: "flex",
  flexWrap: "inherit",
  flexDirection: p.vertical ? "column" : "row",
  width: computeWidthHeight(p).width,
  height: computeWidthHeight(p).height,
  padding: 0,
  margin: 0,

  ...computeAlignment(p),
}))

export type AlignProps = {
  vertical?: boolean
  horizontal?: boolean

  topLeft?: boolean
  topCenter?: boolean
  topRight?: boolean
  left?: boolean
  center?: boolean
  right?: boolean
  bottomLeft?: boolean
  bottomCenter?: boolean
  bottomRight?: boolean

  hug?: boolean | "width" | "height"
}

export const Align = (p: PropsWithChildren<AlignProps>) => (
  <Container
    topLeft={p.topLeft}
    topCenter={p.topCenter}
    topRight={p.topRight}
    left={p.left}
    center={p.center}
    right={p.right}
    bottomLeft={p.bottomLeft}
    bottomCenter={p.bottomCenter}
    bottomRight={p.bottomRight}
    vertical={p.vertical}
    horizontal={p.horizontal}
    hug={p.hug}
  >
    {p.children}
  </Container>
)
