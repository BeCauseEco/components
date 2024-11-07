import { PropsWithChildren, forwardRef } from "react"
import styled from "@emotion/styled"
import { TColor, computeColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"

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

const Container = styled.p<TText>(p => ({
  display: "inline",
  ...(p.monospace ? StyleMonospace : StyleFontFamily),
  color: computeColor(p.color),
  fontStyle: p.italicize ? "italic" : "normal",
  fontWeight: p.emphasize ? 500 : 400,
  textDecoration: p.underline ? "underline" : "inherit",
  textTransform: p.capitalize ? "uppercase" : "inherit",
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

  ...(p.size === "tiny" && StyleBodyTiny),
  ...(p.size === "xsmall" && StyleBodyXsmall),
  ...(p.size === "small" && StyleBodySmall),
  ...(p.size === "medium" && StyleBodyMedium),
  ...(p.size === "large" && StyleBodyLarge),
  ...(p.size === "xLarge" && StyleBodyXLarge),
  ...(p.size === "huge" && StyleBodyHuge),

  ...(!p.wrap && p.size === "tiny" && { lineHeight: StyleBodyTiny.fontSize }),
  ...(!p.wrap && p.size === "xsmall" && { lineHeight: StyleBodyXsmall.fontSize }),
  ...(!p.wrap && p.size === "small" && { lineHeight: StyleBodySmall.fontSize }),
  ...(!p.wrap && p.size === "medium" && { lineHeight: StyleBodyMedium.fontSize }),
  ...(!p.wrap && p.size === "large" && { lineHeight: StyleBodyLarge.fontSize }),
  ...(!p.wrap && p.size === "xLarge" && { lineHeight: StyleBodyXLarge.fontSize }),
  ...(!p.wrap && p.size === "huge" && { lineHeight: StyleBodyHuge.fontSize }),
}))

export type TText = TPlaywright & {
  size: "tiny" | "xsmall" | "small" | "medium" | "large" | "xLarge" | "huge"
  color: TColor
  emphasize?: boolean
  italicize?: boolean
  underline?: boolean
  capitalize?: boolean
  wrap?: boolean
  monospace?: boolean
  title?: string
}

export const Text = forwardRef<HTMLHeadingElement | HTMLParagraphElement, PropsWithChildren<TText>>((p, ref) => {
  const {
    size,
    color,
    emphasize = false,
    italicize = false,
    underline = false,
    capitalize = false,
    wrap = false,
    monospace = false,
    children,
    playwrightTestId,
    ...rest
  } = p

  return (
    <Container
      ref={ref}
      size={size}
      // @ts-expect-error color dictated as being of type string by @emotion/styled
      color={color}
      emphasize={emphasize}
      italicize={italicize}
      underline={underline}
      capitalize={capitalize}
      wrap={wrap}
      monospace={monospace}
      data-playwright-testid={playwrightTestId}
      {...rest}
    >
      {children}
    </Container>
  )
})
