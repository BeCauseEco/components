import { ESize } from "@new/ESize"
import { TColor, computeColor } from "@new/Color"
import styled from "@emotion/styled"
import { EWeight } from "@new/EWeight"

const calculateFontVariantSettings = (size: ESize, weight: EWeight) => {
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

  return `'FILL' 0, 'wght' ${w}, 'GRAD' ${g}, 'opsz' 48`
}

const Container = styled.i<Omit<TIcon, "name"> & { color: TColor; weight: EWeight }>(p => ({
  display: "flex",
  flexShrink: 0,
  width: "fit-content",
  height: p.size,
  lineHeight: p.size,
  fontSize: p.size,
  color: computeColor(p.color),
  "font-variation-settings": calculateFontVariantSettings(p.size, p.weight),
  userSelect: "none",
}))

export type TIcon = {
  name: string | "blank"
  size: ESize
  color: TColor
  weight?: EWeight
}

export const Icon = ({ name, size, color, weight = EWeight.Normal }: TIcon) => {
  return (
    <Container size={size} weight={weight} color={color as any} className="material-symbols-rounded">
      {name === "blank" ? null : name}
    </Container>
  )
}
