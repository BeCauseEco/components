import { ESize } from "@new/ESize"
import { TColor, computeColor } from "@new/Color"
import styled from "@emotion/styled"
import { EWeight } from "@new/EWeight"
import { TPlaywright } from "@new/TPlaywright"

const calculateFontVariantSettings = (size: ESize, weight: EWeight, fill: boolean) => {
  let w = [ESize.Large, ESize.Huge].includes(size) ? "700" : "600"

  const g = [ESize.Large, ESize.Huge].includes(size) ? "0" : "-25"

  switch (weight) {
    case EWeight.Light:
      w = "200"
      break

    case EWeight.Heavy:
      w = "900"
      break
  }

  return `'FILL' ${fill ? "1" : "0"}, 'wght' ${w}, 'GRAD' ${g}, 'opsz' 48`
}

const Container = styled.i<Omit<TIcon, "name">>(p => ({
  display: "flex",
  flexShrink: 0,
  width: "fit-content",
  height: p.size,
  lineHeight: p.size,
  fontSize: `calc(${p.size} * 0.8)`,
  color: computeColor(p.color),
  "font-variation-settings": calculateFontVariantSettings(p.size, p.weight || EWeight.Normal, p.fill || false),
  userSelect: "none",
}))

export type TIcon = TPlaywright & {
  name: string | "blank"
  size: ESize
  color: TColor
  weight?: EWeight
  fill?: boolean
  onClick?: any
}

export const Icon = ({ name, size, color, weight, fill, onClick = undefined, playwrightTestId }: TIcon) => {
  const noop = () => {}

  return (
    <Container
      size={size}
      weight={weight}
      fill={fill}
      color={color as any}
      className="material-symbols-rounded"
      onClick={onClick || noop}
      data-playwright-testid={playwrightTestId}
    >
      {name === "blank" ? null : name}
    </Container>
  )
}
