import styled from "@emotion/styled"
import { computeColor, ColorWithLightness } from "@new/Color"

export type DividerProps = {
  vertical?: boolean
  horizontal?: boolean

  fill: ColorWithLightness
}

const Container = styled.div<Pick<DividerProps, "vertical" | "horizontal"> & { _fill: ColorWithLightness }>(p => ({
  display: "flex",
  flexGrow: 1,
  flexShrink: 0,
  width: p.vertical ? "1px" : "auto",
  height: p.vertical ? "auto" : "1px",
  backgroundColor: computeColor(p._fill),
}))

export const Divider = (p: DividerProps) => (
  <Container className="<Divider /> -" _fill={p.fill} vertical={p.vertical} horizontal={p.horizontal} />
)
