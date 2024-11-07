import styled from "@emotion/styled"
import { ESize } from "@new/ESize"

const Container = styled.div<{ size: string }>(p => ({
  display: "flex",
  flexShrink: 0,
  width: p.size,
  height: p.size,
}))

export type TSpacer = {
  tiny?: boolean
  xsmall?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  xLarge?: boolean
  xxLarge?: boolean
  huge?: boolean
}

export const Spacer = ({ tiny, xsmall, small, medium, large, xLarge, xxLarge, huge }: TSpacer) => {
  let size = "0"

  if (tiny) {
    size = ESize.Tiny
  }

  if (xsmall) {
    size = ESize.Xsmall
  }

  if (small) {
    size = ESize.Small
  }

  if (medium) {
    size = ESize.Medium
  }

  if (large) {
    size = ESize.Large
  }

  if (xLarge) {
    size = ESize.XLarge
  }

  if (xxLarge) {
    size = ESize.XXLarge
  }

  if (huge) {
    size = ESize.Huge
  }

  return <Container size={size} />
}
