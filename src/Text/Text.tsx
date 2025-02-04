import { PropsWithChildren, forwardRef } from "react"
import styled from "@emotion/styled"
import { ColorWithLightness, computeColor } from "@new/Color"
import { PlaywrightProps } from "@new/Playwright"

export const StyleMonospace = {
  fontFamily: "monospace",
  fontOpticalSizing: "auto",
  fontWeight: 500,
  fontStyle: "normal",
  fontVariationSettings: `"wdth" 125`,
}

export const StyleFontFamily = {
  fontFamily: `"Inter", sans-serif`,
  fontStyle: "normal",
  fontWeight: 400,
}

export const StyleBodyTiny = {
  fontSize: "12px",
  lineHeight: "16px",
}

export const StyleBodyXsmall = {
  fontSize: "14px",
  lineHeight: "20px",
}

export const StyleBodySmall = {
  fontSize: "16px",
  lineHeight: "24px",
}

export const StyleBodyMedium = {
  fontSize: "20px",
  lineHeight: "28px",
}

export const StyleBodyLarge = {
  fontSize: "24px",
  lineHeight: "30px",
}

export const StyleBodyXLarge = {
  fontSize: "28px",
  lineHeight: "36px",
}

export const StyleBodyHuge = {
  fontSize: "35px",
  lineHeight: "40px",
}

const Container = styled.p<Omit<TextProps, "fill"> & { _fill: TextProps["fill"] }>(p => ({
  display: "inline",

  ...(p.monospace ? StyleMonospace : StyleFontFamily),

  color: computeColor(p._fill),
  textDecoration: "inherit",
  textTransform: "inherit",
  textWrap: !p.maxWidth && p.wrap ? "pretty" : "nowrap",
  // wordBreak: !p.maxWidth && p.wrap ? "break-all" : "normal",
  textAlign: "left",
  alignItems: "inherit",
  margin: 0,

  "& strong, & b": {
    fontWeight: 600,
  },

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

  ...(p.maxWidth && {
    overflowX: "hidden",
    overflowY: "hidden",
    textOverflow: "ellipsis",
    textWrap: "nowrap",
    display: "inline-block",
    maxWidth: p.maxWidth,
  }),

  ...(p.tiny && StyleBodyTiny),
  ...(p.xsmall && StyleBodyXsmall),
  ...(p.small && StyleBodySmall),
  ...(p.medium && StyleBodyMedium),
  ...(p.large && StyleBodyLarge),
  ...(p.xLarge && StyleBodyXLarge),
  ...(p.huge && StyleBodyHuge),

  // TODO: @cllpse: investigate why !important is needed here
  ...(!p.wrap && p.tiny && { lineHeight: `${StyleBodyTiny.fontSize} !important` }),
  ...(!p.wrap && p.xsmall && { lineHeight: `${StyleBodyXsmall.fontSize} !important` }),
  ...(!p.wrap && p.small && { lineHeight: `${StyleBodySmall.fontSize} !important` }),
  ...(!p.wrap && p.medium && { lineHeight: `${StyleBodyMedium.fontSize} !important` }),
  ...(!p.wrap && p.large && { lineHeight: `${StyleBodyLarge.fontSize} !important` }),
  ...(!p.wrap && p.xLarge && { lineHeight: `${StyleBodyXLarge.fontSize} !important` }),
  ...(!p.wrap && p.huge && { lineHeight: `${StyleBodyHuge.fontSize} !important` }),
}))

export type TextProps = PlaywrightProps & {
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

  /**
   * Last resort for triggering text-overflow: ellipsis
   */
  maxWidth?: `${number}${"px"}`

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
    maxWidth,

    monospace = false,

    children,

    ...rest
  } = p

  return (
    <Container
      className="<Text /> -"
      ref={ref}
      tiny={tiny}
      xsmall={xsmall}
      small={small}
      medium={medium}
      large={large}
      xLarge={xLarge}
      xxLarge={xxLarge}
      huge={huge}
      _fill={fill}
      wrap={wrap ? true : undefined}
      maxWidth={maxWidth}
      monospace={monospace}
      data-playwright-testid={p["data-playwright-testid"]}
      {...rest}
    >
      {children}
    </Container>
  )
})
