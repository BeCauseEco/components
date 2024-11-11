import styled from "@emotion/styled"
import { computeColor, ColorWithLightness } from "@new/Color"
import React from "react"

export type TDivider = {
  color: ColorWithLightness
}

const Container = styled.div<TDivider>(p => ({
  display: "flex",
  width: "100%",
  height: "1px",
  backgroundColor: computeColor(p.color),
}))

export const Divider = ({ color }: TDivider) => (
  <Container
    // @ts-expect-error color is reserved by styled components, and complains when it's overwritten
    color={color}
  />
)
