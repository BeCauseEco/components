import styled from "@emotion/styled"
import { PlaywrightProps } from "@new/Playwright"
import { Size } from "@new/Size"

const Container = styled.div<{ size: string; overrideWidth?: string; overrideHeight?: string }>(p => ({
  display: "flex",
  flexShrink: 0,
  width: p.overrideWidth || p.size,
  height: p.overrideHeight || p.size,
}))

export type SpacerProps = PlaywrightProps & {
  tiny?: boolean
  xsmall?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  xLarge?: boolean
  xxLarge?: boolean
  huge?: boolean

  overrideWidth?: string
  overrideHeight?: string
}

export const Spacer = (p: SpacerProps) => {
  let size = "0"

  if (p.tiny) {
    size = Size.Tiny
  }

  if (p.xsmall) {
    size = Size.Xsmall
  }

  if (p.small) {
    size = Size.Small
  }

  if (p.medium) {
    size = Size.Medium
  }

  if (p.large) {
    size = Size.Large
  }

  if (p.xLarge) {
    size = Size.XLarge
  }

  if (p.xxLarge) {
    size = Size.XXLarge
  }

  if (p.huge) {
    size = Size.Huge
  }

  return (
    <Container className={`<Spacer />`} size={size} overrideWidth={p.overrideWidth} overrideHeight={p.overrideHeight} />
  )
}
