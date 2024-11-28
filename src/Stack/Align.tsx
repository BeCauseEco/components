import { PropsWithChildren } from "react"
import styled from "@emotion/styled"
import { ComponentBaseProps } from "@new/ComponentBaseProps"

const computeAlignment = (p: Omit<AlignProps, "spacing" | "hug">) => {
  const r = {
    justifyContent: "",
    alignItems: "",
    alignSelf: "",
    justifySelf: "",
  }

  if (p.vertical) {
    if (p.topLeft) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p.topCenter) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p.topRight) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p.left) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-start"
      r.alignItems = "flex-start"
    }

    if (p.center) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p.right) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p.bottomLeft) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p.bottomCenter) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p.bottomRight) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }
  } else if (p.horizontal) {
    if (p.topLeft) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p.topCenter) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p.topRight) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p.left) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p.center) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p.right) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p.bottomLeft) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p.bottomCenter) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p.bottomRight) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }
  }

  return r
}

const computeWidthHeight = (p: AlignProps) => {
  let w = "100%"
  let h = "100%"

  if (p.hug === true) {
    w = "min-content"
    h = "min-content"
  } else if (p.hug === "width") {
    w = "min-content"
  } else if (p.hug === "height") {
    h = "min-content"
  }

  return { width: w, height: h }
}

const Container = styled.div<AlignProps>(p => ({
  display: "flex",
  flexWrap: p.wrap ? "wrap" : "nowrap",
  flexDirection: p.vertical ? "column" : "row",
  padding: 0,
  margin: 0,

  ...(p.wrap && {
    gap: "calc(var(--BU) * 4)",
  }),

  ...computeWidthHeight(p),
  ...computeAlignment(p),
}))

export type AlignProps = ComponentBaseProps & {
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

  wrap?: boolean
}

export const Align = (p: PropsWithChildren<AlignProps>) => (
  <Container
    className={`<Align /> -`}
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
    wrap={p.wrap}
  >
    {p.children}
  </Container>
)
