import { Size } from "@new/Size"
import { ColorWithLightness, computeColor } from "@new/Color"
import styled from "@emotion/styled"
import { PlaywrightProps } from "@new/Playwright"

const computeSize = (p: IconProps) => {
  let size = "0"

  if (p.tiny) {
    size = "10px"
  }

  if (p.xsmall) {
    size = "12px"
  }

  if (p.small) {
    size = "16px"
  }

  if (p.medium) {
    size = "20px"
  }

  if (p.large) {
    size = "24px"
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

  return size
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const computeStyle = (p: IconProps) => {
  // console.log("computeStyle", p)

  return p.style === "outlined" ? "0" : "1"
}

const computeFontVariantSettings = (p: IconProps) => {
  // let w = [Size.Large, Size.Huge].includes(p.size) ? "700" : "600"

  // const g = [Size.Large, Size.Huge].includes(p.size) ? "0" : "-25"

  // switch (p.weight) {
  //   case EWeight.Light:
  //     w = "200"
  //     break

  //   case EWeight.Heavy:
  //     w = "900"
  //     break
  // }

  const w = "600"
  const g = "0"

  return `'FILL' ${computeStyle(p)}, 'wght' ${w}, 'GRAD' ${g}, 'opsz' 48`
}

const Container = styled.i<{ size: string; fontVariationSettings: string; _fill: IconProps["fill"] }>(p => ({
  display: "flex !important",
  flexShrink: 0,
  width: "fit-content",
  height: p.size,
  lineHeight: `${p.size} !important`,
  fontSize: `calc(${p.size} * 0.875) !important`,
  color: computeColor(p._fill),
  "font-variation-settings": p.fontVariationSettings,
  userSelect: "none",
}))

export type IconProps = PlaywrightProps & {
  name: string | "blank"
  fill: ColorWithLightness

  tiny?: boolean
  xsmall?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  xLarge?: boolean
  xxLarge?: boolean
  huge?: boolean

  style?: "filled" | "outlined" | "rounded" | "twotone" | "sharp"

  onClick?: any
}

export const Icon = (p: IconProps) => (
  <Container
    className="<Icon /> - material-symbols-rounded"
    size={computeSize(p)}
    fontVariationSettings={computeFontVariantSettings(p)}
    _fill={p.fill}
    onClick={p.onClick}
    data-playwright-testid={p.playwrightTestId}
  >
    {p.name === "blank" ? null : p.name}
  </Container>
)
