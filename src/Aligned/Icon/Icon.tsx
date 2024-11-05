import { ESize } from "@new/ESize"
import { TColor, computeColor } from "@new/Color"
import styled from "@emotion/styled"
import { TPlaywright } from "@new/TPlaywright"

const computeSize = (p: TIcon) => {
  let size = "0"

  if (p.tiny) {
    size = ESize.Tiny
  }

  if (p.xsmall) {
    size = ESize.Xsmall
  }

  if (p.small) {
    size = ESize.Small
  }

  if (p.medium) {
    size = ESize.Medium
  }

  if (p.large) {
    size = ESize.Large
  }

  if (p.xLarge) {
    size = ESize.XLarge
  }

  if (p.xxLarge) {
    size = ESize.XXLarge
  }

  if (p.huge) {
    size = ESize.Huge
  }

  return size
}

const computeStyle = (p: TIcon) => {
  console.log("computeStyle", p)

  return "1"
}

const computeFontVariantSettings = (p: TIcon) => {
  // let w = [ESize.Large, ESize.Huge].includes(p.size) ? "700" : "600"

  // const g = [ESize.Large, ESize.Huge].includes(p.size) ? "0" : "-25"

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

const Container = styled.i<Pick<TIcon, "fill"> & { size: string; fontVariationSettings: string }>(p => ({
  display: "flex !important",
  flexShrink: 0,
  width: "fit-content",
  height: p.size,
  lineHeight: `${p.size} !important`,
  fontSize: `${p.size} !important`,
  color: computeColor(p.fill),
  "font-variation-settings": p.fontVariationSettings,
  userSelect: "none",
}))

export type TIcon = TPlaywright & {
  name: string | "blank"
  fill: TColor

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

export const Icon = (p: TIcon) => (
  <Container
    size={computeSize(p)}
    fontVariationSettings={computeFontVariantSettings(p)}
    fill={p.fill as any}
    className="material-symbols-rounded"
    onClick={p.onClick}
    data-playwright-testid={p.playwrightTestId}
  >
    {p.name === "blank" ? null : p.name}
  </Container>
)
