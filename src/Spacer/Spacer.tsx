import styled from "@emotion/styled"
import { Size } from "@new/Size"

const Container = styled.div<{ size: string }>(p => ({
  display: "flex",
  flexShrink: 0,
  width: p.size,
  height: p.size,
}))

export type SpacerProps = {
  tiny?: boolean
  xsmall?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  xLarge?: boolean
  xxLarge?: boolean
  huge?: boolean
}

export const Spacer = ({ tiny, xsmall, small, medium, large, xLarge, xxLarge, huge }: SpacerProps) => {
  let size = "0"

  if (tiny) {
    size = Size.Tiny
  }

  if (xsmall) {
    size = Size.Xsmall
  }

  if (small) {
    size = Size.Small
  }

  if (medium) {
    size = Size.Medium
  }

  if (large) {
    size = Size.Large
  }

  if (xLarge) {
    size = Size.XLarge
  }

  if (xxLarge) {
    size = Size.XXLarge
  }

  if (huge) {
    size = Size.Huge
  }

  return <Container size={size} />
}
