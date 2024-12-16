import { PropsWithChildren } from "react"
import styled from "@emotion/styled"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { computeAlignment, computeWidthHeight } from "./internal/Functions"
import { validateChildren } from "@new/Functions"

export type AlignProps = ComponentBaseProps & {
  key?: string

  /**
   * Only one of "vertical" or "horizontal" or "wrap" can be true
   */
  vertical?: boolean
  horizontal?: boolean
  wrap?: boolean | "partly"

  /**
   * Only one of "topLeft" or "topCenter" or "topRight" {...} or "bottomRight" can be true
   */
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

const Container = styled.div<AlignProps>(p => ({
  display: "flex",
  flexWrap: p["wrap"] ? "wrap" : "nowrap",
  flexDirection: p["vertical"] ? "column" : "row",
  padding: 0,
  margin: 0,

  ...(p["wrap"] && {
    gap: p["wrap"] === "partly" ? "calc(var(--BU) * 2)" : "calc(var(--BU) * 4)",
  }),

  ...computeWidthHeight(p),
  ...computeAlignment(p),

  ...p?.childrenValidationResult?.styles,
}))

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
    childrenValidationResult={validateChildren("disallow", ["Align"], p.children)}
  >
    {p.children}
  </Container>
)
