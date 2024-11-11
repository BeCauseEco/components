import { PropsWithChildren, forwardRef } from "react"
import styled from "@emotion/styled"
import { ColorWithLightness, computeColor } from "@new/Color"
import { Playwright } from "@new/Playwright"

export const StyleMonospace = {
  fontFamily: "monospace",
  fontOpticalSizing: "auto",
  fontWeight: 500,
  fontStyle: "normal",
  fontVariationSettings: `"wdth" 125`,
}

export const StyleFontFamily = {
  fontFamily: `"Inter", sans-serif`,
}

export const StyleBodyTiny = {
  fontSize: "12px",
  lineHeight: "16px",
  letterSpacing: "0.0025em",
}

export const StyleBodyXsmall = {
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0em",
}

export const StyleBodySmall = {
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0em",
}

export const StyleBodyMedium = {
  fontSize: "20px",
  lineHeight: "28px",
  letterSpacing: "-0.005em",
}

export const StyleBodyLarge = {
  fontSize: "24px",
  lineHeight: "30px",
  letterSpacing: "-0.00625em",
}

export const StyleBodyXLarge = {
  fontSize: "28px",
  lineHeight: "36px",
  letterSpacing: "-0.0075em",
}

export const StyleBodyHuge = {
  fontSize: "35px",
  lineHeight: "40px",
  letterSpacing: "-0.01em",
}

const Container = styled.p<TextProps>(p => ({
  display: "inline",

  ...(p.monospace ? StyleMonospace : StyleFontFamily),

  color: computeColor(p.fill),
  fontStyle: "normal",
  fontWeight: 400,
  textDecoration: "inherit",
  textTransform: "inherit",
  textWrap: p.wrap ? "pretty" : "nowrap",
  textAlign: "left",
  alignItems: "inherit",

  "& a": {
    color: "inherit",
  },

  "& abbr": {
    textDecoration: "dotted 1px inherit",
    cursor: "help",
  },

  "::selection": {
    background: "rgba(0, 0, 0, 0.2)",
    // filter: "brightness(0.8)",
  },

  ...(p.tiny && StyleBodyTiny),
  ...(p.xsmall && StyleBodyXsmall),
  ...(p.small && StyleBodySmall),
  ...(p.medium && StyleBodyMedium),
  ...(p.large && StyleBodyLarge),
  ...(p.xLarge && StyleBodyXLarge),
  ...(p.huge && StyleBodyHuge),

  ...(!p.wrap && p.tiny && { lineHeight: StyleBodyTiny.fontSize }),
  ...(!p.wrap && p.xsmall && { lineHeight: StyleBodyXsmall.fontSize }),
  ...(!p.wrap && p.small && { lineHeight: StyleBodySmall.fontSize }),
  ...(!p.wrap && p.medium && { lineHeight: StyleBodyMedium.fontSize }),
  ...(!p.wrap && p.large && { lineHeight: StyleBodyLarge.fontSize }),
  ...(!p.wrap && p.xLarge && { lineHeight: StyleBodyXLarge.fontSize }),
  ...(!p.wrap && p.huge && { lineHeight: StyleBodyHuge.fontSize }),
}))

export type TextProps = Playwright & {
  tiny?: boolean
  xsmall?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  xLarge?: boolean
  xxLarge?: boolean
  huge?: boolean

  fill: ColorWithLightness

  wrap?: boolean

  monospace?: boolean
}

export const Text = forwardRef<HTMLHeadingElement | HTMLParagraphElement, PropsWithChildren<TextProps>>((p, ref) => {
  const {
    tiny,
    xsmall,
    small,
    medium,
    large,
    xLarge,
    xxLarge,
    huge,

    fill,

    wrap = false,

    monospace = false,

    children,

    playwrightTestId,

    ...rest
  } = p

  return (
    <Container
      ref={ref}
      tiny={tiny}
      xsmall={xsmall}
      small={small}
      medium={medium}
      large={large}
      xLarge={xLarge}
      xxLarge={xxLarge}
      huge={huge}
      fill={fill}
      wrap={wrap}
      monospace={monospace}
      data-playwright-testid={playwrightTestId}
      {...rest}
    >
      {children}
    </Container>
  )
})
