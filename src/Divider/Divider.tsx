import styled from "@emotion/styled"
import { computeColor, ColorWithLightness } from "@new/Color"
import { ComponentBaseProps } from "@new/ComponentBaseProps"

export type DividerProps = ComponentBaseProps & {
  vertical?: boolean
  horizontal?: boolean

  fill: ColorWithLightness
  style: "solid" | "dotted"

  /**
   * WARNING: internal property - only to be used within /components
   */
  overrideWidth?: `${number}${"px" | "%"}`
  /**
   * WARNING: internal property - only to be used within /components
   */
  overrideHeight?: `${number}${"px" | "%"}`
}

const Container = styled.div<
  Pick<DividerProps, "vertical" | "horizontal" | "overrideWidth" | "overrideHeight"> & {
    _fill: ColorWithLightness
    _style: string
  }
>(p => ({
  display: "flex",
  flexShrink: 0,
  width: p.vertical ? "0px" : p.overrideWidth ? p.overrideWidth : "100%",
  height: !p.vertical ? "0px" : p.overrideHeight ? p.overrideHeight : "100%",
  ...(p.vertical && { borderRight: `${p._style} 1px ${computeColor(p._fill)}` }),
  ...(!p.vertical && { borderTop: `${p._style} 1px ${computeColor(p._fill)}` }),
}))

export const Divider = (p: DividerProps) => (
  <Container
    className="<Divider /> -"
    data-playwright-testid={p["data-playwright-testid"]}
    _fill={p.fill}
    _style={p.style === "dotted" ? "dotted" : "solid"}
    vertical={p.vertical}
    horizontal={p.horizontal}
    overrideWidth={p.overrideWidth}
    overrideHeight={p.overrideHeight}
  />
)
