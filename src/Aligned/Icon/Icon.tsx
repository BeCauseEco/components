import { TColor, computeColor } from "@new/Color"
import styled from "@emotion/styled"
import { TPlaywright } from "@new/TPlaywright"

const calculateFontVariantSettings = (p: Pick<TIcon, "size" | "weight" | "fill">) => {
  let w = ["large", "xlarge", "huge"].includes(p.size) ? "700" : "600"
  const g = ["large", "xlarge", "huge"].includes(p.size) ? "0" : "-25"

  switch (p.weight) {
    case "light":
      w = "200"
      break

    case "normal":
    case "heavy":
      w = "900"
      break
  }

  return `'FILL' ${p.fill ? "1" : "0"}, 'wght' ${w}, 'GRAD' ${g}, 'opsz' 48`
}

const Container = styled.i<Omit<TIcon, "name">>(p => ({
  display: "flex",
  flexShrink: 0,
  width: "fit-content",
  height: p.size,
  lineHeight: p.size,
  fontSize: `calc(${p.size} * 0.8)`,
  color: computeColor(p.color),

  "font-variation-settings": calculateFontVariantSettings({
    size: p.size,
    weight: p.weight || "normal",
    fill: p.fill || false,
  }),

  userSelect: "none",
}))

export type TIcon = TPlaywright & {
  name: string | "blank"
  size: "tiny" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "huge"
  color: TColor
  weight?: "light" | "normal" | "heavy"
  fill?: boolean
  onClick?: () => void
}

export const Icon = ({ name, size, color, weight, fill, onClick = undefined, playwrightTestId }: TIcon) => (
  <Container
    size={size}
    weight={weight}
    fill={fill}
    // @ts-expect-error color dictated as being of type string by @emotion/styled
    color={color}
    className="material-symbols-rounded"
    onClick={onClick}
    data-playwright-testid={playwrightTestId}
  >
    {name === "blank" ? null : name}
  </Container>
)
