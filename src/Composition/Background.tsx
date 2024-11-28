import { Color, ColorWithLightness, computeColor } from "@new/Color"
import { EShadow } from "@new/EShadow"
import { Size } from "@new/Size"
import styled from "@emotion/styled"
import { css, Global } from "@emotion/react"
import { PlaywrightProps } from "@new/Playwright"

const calculateBorderRadius = (size?: Size): string => {
  switch (size) {
    case Size.Small:
      return "var(--BU)"

    case Size.Medium:
      return "calc(var(--BU) * 1.5)"

    case Size.Large:
      return "calc(var(--BU) * 2)"

    default:
      return "0"
  }
}

const Container = styled.div<TBackground>(p => ({
  position: "relative",
  display: "flex",
  flexGrow: 1,
  outlineOffset: "-1px",
  boxShadow: p.shadow ? p.shadow : "none",
  borderRadius: calculateBorderRadius(p.borderRadius),
  transition: "background-color 0.025s ease-in",
  cursor: "inherit",

  // ...(p.stacked && {
  //   "&:before, &:after": {
  //     content: `""`,
  //     position: "absolute",
  //     bottom: "-2rem",
  //     left: "2rem",
  //     right: "2rem",
  //     width: "calc(100% - 4rem)",
  //     height: "2rem",
  //     backgroundColor: "inherit",
  //     filter: "brightness(0.8)",
  //     borderBottomLeftRadius: p.borderRadius ? p.borderRadius : 0,
  //     borderBottomRightRadius: p.borderRadius ? p.borderRadius : 0,
  //   },

  //   "&:after": {
  //     bottom: "-4rem",
  //     left: "4rem",
  //     right: "4rem",
  //     width: "calc(100% - 8rem)",
  //     filter: "brightness(0.75)",
  //   },
  // }),
}))

export type TBackground = PlaywrightProps & {
  colorBackground?: ColorWithLightness
  colorBackgroundHover?: ColorWithLightness
  colorOutline?: ColorWithLightness
  colorOutlineHover?: ColorWithLightness
  borderRadius?: Size.Small | Size.Medium | Size.Large
  shadow?: EShadow
  stacked?: boolean
}

export const Background = ({
  colorBackground,
  colorBackgroundHover,
  colorOutline,
  colorOutlineHover,
  borderRadius,
  shadow,
  stacked,
  playwrightTestId,
}: TBackground) => {
  // TO-DO: @cllpse: clean up at a later date
  const id = Math.random().toString().replace(".", "")

  const c = css`
    .component-composition > .component-composition-background > .component-backgroundcard-${id} {
      background-color: ${computeColor(colorBackground || [Color.Transparent])};
      outline: solid 1px ${computeColor(colorOutline || [Color.Transparent])};
    }

    .component-composition:hover > .component-composition-background > .component-backgroundcard-${id} {
      background-color: ${computeColor(colorBackgroundHover || colorBackground || [Color.Transparent])} !important;
      outlinecolor: ${computeColor(colorOutlineHover || colorOutline || [Color.Transparent])} !important;
    }
  `

  return (
    <>
      <Global styles={c} />

      <Container
        className={`component-backgroundcard-${id}`}
        colorBackground={colorBackground}
        colorBackgroundHover={colorBackgroundHover}
        colorOutline={colorOutline}
        colorOutlineHover={colorOutlineHover}
        borderRadius={borderRadius}
        shadow={shadow}
        stacked={stacked}
        data-playwright-testid={playwrightTestId}
      />
    </>
  )
}
