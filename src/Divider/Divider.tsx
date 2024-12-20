import styled from "@emotion/styled"
import { computeColor, ColorWithLightness } from "@new/Color"
import { ComponentBaseProps } from "@new/ComponentBaseProps"

export type DividerProps = ComponentBaseProps & {
  vertical?: boolean
  horizontal?: boolean

  fill: ColorWithLightness

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
  Pick<DividerProps, "vertical" | "horizontal" | "overrideWidth" | "overrideHeight"> & { _fill: ColorWithLightness }
>(p => ({
  display: "flex",
  flexShrink: 0,
  width: p.vertical ? "1px" : p.overrideWidth ? p.overrideWidth : "100%",
  height: !p.vertical ? "1px" : p.overrideHeight ? p.overrideHeight : "100%",
  backgroundColor: computeColor(p._fill),
}))

export const Divider = (p: DividerProps) => (
  <Container
    className="<Divider /> -"
    data-playwright-testid={p.playwrightTestId}
    _fill={p.fill}
    vertical={p.vertical}
    horizontal={p.horizontal}
    overrideWidth={p.overrideWidth}
    overrideHeight={p.overrideHeight}
  />
)
