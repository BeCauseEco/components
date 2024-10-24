import { PropsWithChildren, forwardRef } from "react"
import styled from "@emotion/styled"
import { TColor, computeColor } from "@new/Color"
import { ESize } from "@new/ESize"
import { EAlignment } from "@new/EAlignment"
import { TPlaywright } from "@new/TPlaywright"

type TContainerProperties = TText & { color: TColor; alignment?: EAlignment }

const computeAlignment = (alignment?: EAlignment) => {
  switch (alignment) {
    case EAlignment.Start:
      return "left"

    case EAlignment.Middle:
      return "center"

    case EAlignment.End:
      return "right"

    default:
      return "inherit"
  }
}

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

const Container = styled.p<TContainerProperties>(p => ({
  display: "inline",
  ...(p.monospace ? StyleMonospace : StyleFontFamily),
  color: computeColor(p.color),
  fontStyle: p.italicize ? "italic" : "normal",
  fontWeight: p.emphasize ? 500 : 400,
  textDecoration: p.underline ? "underline" : "inherit",
  textTransform: p.capitalize ? "uppercase" : "inherit",
  textWrap: p.wrap ? "pretty" : "nowrap",
  textAlign: computeAlignment(p.alignment),
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

  ...(p.size === ESize.Tiny && StyleBodyTiny),
  ...(p.size === ESize.Xsmall && StyleBodyXsmall),
  ...(p.size === ESize.Small && StyleBodySmall),
  ...(p.size === ESize.Medium && StyleBodyMedium),
  ...(p.size === ESize.Large && StyleBodyLarge),
  ...(p.size === ESize.XLarge && StyleBodyXLarge),
  ...(p.size === ESize.Huge && StyleBodyHuge),

  ...(!p.wrap && p.size === ESize.Tiny && { lineHeight: StyleBodyTiny.fontSize }),
  ...(!p.wrap && p.size === ESize.Xsmall && { lineHeight: StyleBodyXsmall.fontSize }),
  ...(!p.wrap && p.size === ESize.Small && { lineHeight: StyleBodySmall.fontSize }),
  ...(!p.wrap && p.size === ESize.Medium && { lineHeight: StyleBodyMedium.fontSize }),
  ...(!p.wrap && p.size === ESize.Large && { lineHeight: StyleBodyLarge.fontSize }),
  ...(!p.wrap && p.size === ESize.XLarge && { lineHeight: StyleBodyXLarge.fontSize }),
  ...(!p.wrap && p.size === ESize.Huge && { lineHeight: StyleBodyHuge.fontSize }),
}))

export type TText = TPlaywright & {
  size: ESize
  color: TColor
  emphasize?: boolean
  italicize?: boolean
  underline?: boolean
  capitalize?: boolean
  alignment?: EAlignment
  wrap?: boolean
  monospace?: boolean
  title?: string
}

export const Text = forwardRef<HTMLHeadingElement | HTMLParagraphElement, PropsWithChildren<TText>>((props, ref) => {
  const {
    size,
    color,
    emphasize = false,
    italicize = false,
    underline = false,
    capitalize = false,
    alignment = undefined,
    wrap = false,
    monospace = false,
    children,
    title,
    playwrightTestId,
  } = props

  return (
    <Container
      ref={ref}
      size={size}
      color={color}
      emphasize={emphasize}
      italicize={italicize}
      underline={underline}
      capitalize={capitalize}
      wrap={wrap}
      monospace={monospace}
      textAlign={computeAlignment(alignment)}
      title={title}
      data-playwright-testid={playwrightTestId}
      {...(props as any)}
    >
      {children}
    </Container>
  )
})
