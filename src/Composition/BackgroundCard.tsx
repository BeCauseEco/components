import { Color, ColorWithLightness, computeColor } from "@new/Color"
import { EShadow } from "@new/EShadow"
import { Size } from "@new/Size"
import styled from "@emotion/styled"
import { css, Global } from "@emotion/react"
import { PlaywrightProps } from "@new/Playwright"

const Container = styled.div<TBackgroundCard>(p => ({
  position: "relative",
  display: "flex",
  flexGrow: 1,
  outlineOffset: "-1px",
  boxShadow: p.shadow ? p.shadow : "none",
  borderRadius: p.borderRadius ? p.borderRadius : 0,
  transition: "background-color 0.025s ease-in",
  cursor: "inherit",
}))

export type TBackgroundCard = PlaywrightProps & {
  colorBackground?: ColorWithLightness
  colorBackgroundHover?: ColorWithLightness
  colorBorder?: ColorWithLightness
  colorBorderHover?: ColorWithLightness
  borderRadius?: Size.Tiny | Size.Small | Size.Medium
  shadow?: EShadow
  stacked?: boolean
}

export const BackgroundCard = (p: TBackgroundCard) => {
  // TO-DO: @cllpse: clean up at a later date
  const id = Math.random().toString().replace(".", "")

  const c = css`
    .component-composition > .component-composition-background > .component-backgroundcard-${id} {
      background-color: ${computeColor(p.colorBackground || [Color.Transparent])};
      border: solid 1px ${computeColor(p.colorBorder || [Color.Transparent])};
    }

    .component-composition:hover > .component-composition-background > .component-backgroundcard-${id} {
      background-color: ${computeColor(p.colorBackgroundHover || p.colorBackground || [Color.Transparent])} !important;
      border-color: ${computeColor(p.colorBorderHover || p.colorBorder || [Color.Transparent])} !important;
    }
  `

  return (
    <>
      <Global styles={c} />

      <Container
        className={`component-backgroundcard-${id}`}
        colorBackground={p.colorBackground}
        colorBackgroundHover={p.colorBackgroundHover}
        colorBorder={p.colorBorder}
        colorBorderHover={p.colorBorderHover}
        borderRadius={p.borderRadius}
        shadow={p.shadow}
        stacked={p.stacked}
        data-playwright-testid={p["data-playwright-testid"]}
      />
    </>
  )
}
