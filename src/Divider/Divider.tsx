import styled from "@emotion/styled"
import { computeColor, ColorWithLightness } from "@new/Color"

export type DividerProps = {
  vertical?: boolean
  horizontal?: boolean

  fill: ColorWithLightness
}

const Container = styled.div<DividerProps>(p => ({
  display: "flex",
  width: p.vertical ? "1px" : "100%",
  height: p.vertical ? "100%" : "1px",
  backgroundColor: computeColor(p.fill),
}))

export const Divider = (p: DividerProps) => (
  <Container className="<Divider /> -" fill={p.fill} vertical={p.vertical} horizontal={p.horizontal} />
)
