import { PropsWithChildren } from "react"
import styled from "@emotion/styled"

const computeAlignment = (p: Omit<TAlign, "spacing">) => {
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

const Container = styled.div<TAlign>(p => ({
  display: "flex",
  flexWrap: "inherit",
  flexDirection: p.vertical ? "column" : "row",
  width: "100%",
  height: "100%",

  ...computeAlignment(p),
}))

export type TAlign = {
  vertical?: true
  horizontal?: true
  topLeft: true
  topCenter: true
  topRight: true
  left: true
  center: true
  right: true
  bottomLeft: true
  bottomCenter: true
  bottomRight: true
}

export const Align = (p: PropsWithChildren<TAlign>) => (
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
  >
    {p.children}
  </Container>
)
