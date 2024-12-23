import React, { PropsWithChildren, ReactElement, forwardRef } from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { TBackgroundCard } from "@new/Composition/BackgroundCard"
import { TLayoutSingle } from "@new/Composition/LayoutSingle"
import { TLayoutSplit } from "@new/Composition/LayoutSplit"
import { TLayoutThirds } from "@new/Composition/LayoutThirds"
import { TLayoutGrid } from "@new/Composition/LayoutGrid"
import { TLayoutGridDEPRICATED } from "@new/Composition/LayoutGridDEPRICATED"
import { TLayoutStack } from "@new/Composition/LayoutStack"
import { TLayoutBase } from "./TLayoutBase"
import { PlaywrightProps } from "@new/Playwright"
import { computeColor, Color, ColorWithLightness } from "@new/Color"
import { TBackground } from "./Background"

const Container = styled.div<
  Pick<TComposition, "loading" | "disabled" | "explodeHeight" | "overflowHidden" | "onClick">
>(p => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderRadius: "inherit",
  width: "100%",
  height: p.explodeHeight ? "100%" : "auto",
  cursor: p.disabled ? "not-allowed" : p.loading ? "wait" : p.onClick ? "pointer" : "auto",
  overflow: p.overflowHidden ? "hidden" : "visible",
  containerType: "normal",
}))

const Background = styled.div({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 0,
  cursor: "inherit",
})

const Loader = styled.div<Pick<TComposition, "loading">>(p => ({
  display: p.loading ? "flex" : "none",
  position: "absolute",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 0,
  cursor: "inherit",
  containerType: "size",
  overflow: "hidden",
}))

const keyframeA = keyframes({
  "0%": { clipPath: "polygon(50% 50%, 0 0,50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0% )" },
  "12.5%": { clipPath: "polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0% )" },
  "25%": { clipPath: "polygon(50% 50%, 0 0, 50% 0%, 100%   0%, 100% 100%, 100% 100%, 100% 100% )" },
  "50%": { clipPath: "polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100% )" },
  "62.5%": { clipPath: "polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100% )" },
  "75%": { clipPath: "polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100% )" },
  "100%": { clipPath: "polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100% )" },
})

const keyframeB = keyframes({
  "0%": { transform: "scaleY(1) rotate(0deg)" },
  "49.99%": { transform: "scaleY(1) rotate(135deg)" },
  "50%": { transform: "scaleY(-1) rotate(0deg)" },
  "100%": { transform: "scaleY(-1) rotate(-135deg)" },
})

const Spinner = styled.div<Pick<TComposition, "loading"> & { color: ColorWithLightness }>(p => ({
  diplay: "flex",
  height: "100%",
  aspectRatio: "1",
  borderRadius: "50%",
  border: `2px solid ${computeColor([Color.Neutral, 700])}`,
  animation: `${keyframeA} 0.8s infinite linear alternate, ${keyframeB} 1.6s infinite linear;`,
  opacity: p.loading ? 1 : 0,

  "@container (height > 16px)": {
    height: "50%",
    border: `2px solid ${computeColor(p.color)}`,
  },

  "@container (height > 32px)": {
    height: "50%",
    border: `3px solid ${computeColor(p.color)}`,
  },

  "@container (height > 40px)": {
    height: "50%",
    border: `4px solid ${computeColor(p.color)}`,
  },
}))

const Layout = styled.div<Pick<TComposition, "loading" | "disabled">>(p => ({
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  height: "inherit",
  cursor: "inherit",
  transition: "opacity 0.2s ease-in-out",
  willChange: "opacity",

  ...(p.loading
    ? {
        opacity: 0,
        height: "unset",
        minHeight: "fit-content",
        maxHeight: "calc(var(--BU) * 40)",
        overflow: "hidden",

        "& *": {
          pointerEvents: "none",
        },
      }
    : {}),

  ...(p.disabled
    ? {
        opacity: 0.6,

        "& *": {
          pointerEvents: "none",
        },
      }
    : {}),
}))

type AllowedBackgrounds = TBackgroundCard | TBackground

type TAllowedLayouts =
  | TLayoutSingle
  | TLayoutSplit
  | TLayoutThirds
  | TLayoutGrid
  | TLayoutGridDEPRICATED
  | TLayoutStack
  | TLayoutBase

export type TComposition = PlaywrightProps & {
  children: ReactElement<TAllowedLayouts> | [ReactElement<AllowedBackgrounds>, ReactElement<TAllowedLayouts>]
  loading?: boolean
  disabled?: boolean
  explodeHeight?: boolean
  overflowHidden?: boolean
  onClick?: () => void
}

export const Composition = forwardRef<HTMLDivElement, PropsWithChildren<TComposition>>((props, ref) => {
  const { children, loading = false, disabled = false, explodeHeight = false, overflowHidden = false, onClick } = props

  const c = React.Children.toArray(children)

  let colorSpinner = [Color.Neutral, 700]

  if (c.length > 1) {
    const colorBackgroundBase = c[0]?.["props"]?.["colorBackground"]?.[0]
    const colorBackgroundHoverBase = c[0]?.["props"]?.["colorBackgroundHover"]?.[0]
    const colorOutline = c[0]?.["props"]?.["colorOutline"]?.[0]

    colorSpinner = [colorBackgroundBase || colorBackgroundHoverBase || colorOutline, 400]
  }

  return (
    <Container
      ref={ref}
      loading={loading}
      disabled={disabled}
      explodeHeight={explodeHeight}
      overflowHidden={overflowHidden}
      className="component-composition component-composition-reset"
      onClick={onClick}
      data-playwright-testid={props["data-playwright-testid"]}
    >
      {c.length === 1 ? (
        <>
          <Loader loading={loading}>
            <Spinner color={colorSpinner as any} loading={loading} />
          </Loader>

          <Layout className="component-composition-layout" loading={loading} disabled={disabled}>
            {c[0]}
          </Layout>
        </>
      ) : (
        <>
          <Background className="component-composition-background">{c[0]}</Background>

          <Loader loading={loading}>
            <Spinner color={colorSpinner as any} loading={loading} />
          </Loader>

          <Layout className="component-composition-layout" loading={loading} disabled={disabled}>
            {c[1]}
          </Layout>
        </>
      )}
    </Container>
  )
})
