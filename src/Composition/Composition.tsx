import React, { PropsWithChildren, ReactElement, forwardRef } from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { TBackgroundCard } from "@new/Composition/BackgroundCard"
import { TLayoutSingle } from "@new/Composition/LayoutSingle"
import { TLayoutSplit } from "@new/Composition/LayoutSplit"
import { TLayoutThirds } from "@new/Composition/LayoutThirds"
import { TLayoutGrid } from "@new/Composition/LayoutGrid"
import { TLayoutBase } from "./TLayoutBase"
import { TPlaywright } from "@new/TPlaywright"

const Container = styled.div<Pick<TComposition, "loading" | "explodeHeight" | "overflowHidden" | "onClick">>(p => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderRadius: "inherit",
  width: "100%",
  height: p.explodeHeight ? "100%" : "auto",
  cursor: p.loading ? "wait" : p.onClick ? "pointer" : "auto",
  overflow: p.overflowHidden ? "hidden" : "visible",
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
  display: "flex",
  position: "absolute",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 0,
  cursor: "inherit",
  transition: "opacity 0.2s ease-in-out",
  opacity: p.loading ? 1 : 0,
  backgroundColor: "red",
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

const Spinner = styled.div({
  width: "50px",
  aspectRatio: "1",
  borderRadius: "50%",
  border: "8px solid #514b82",
  animation: `${keyframeA} 0.8s infinite linear alternate, ${keyframeB} 1.6s infinite linear;`,
})

const Layout = styled.div<Pick<TComposition, "loading">>(p => ({
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  height: "inherit",
  cursor: "inherit",
  transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
  willChange: "opacity, transform",
  transformOrigin: "center",

  ...(p.loading
    ? {
        pointerEvents: "none",
        opacity: 0,
        height: "calc(var(--BU) * 40) !important",
        overflow: "hidden",
        transform: "scale(0.99)",
      }
    : {}),
}))

type AllowedBackgrounds = TBackgroundCard

type TAllowedLayouts = TLayoutSingle | TLayoutSplit | TLayoutThirds | TLayoutGrid | TLayoutBase

export type TComposition = TPlaywright & {
  children: ReactElement<TAllowedLayouts> | [ReactElement<AllowedBackgrounds>, ReactElement<TAllowedLayouts>]
  loading?: boolean
  explodeHeight?: boolean
  overflowHidden?: boolean
  onClick?: () => void
}

export const Composition = forwardRef<HTMLDivElement, PropsWithChildren<TComposition>>((props, ref) => {
  const { children, loading = false, explodeHeight = false, overflowHidden = false, onClick, playwrightTestId } = props

  const c = React.Children.toArray(children)

  return (
    <Container
      ref={ref}
      loading={loading}
      explodeHeight={explodeHeight}
      overflowHidden={overflowHidden}
      className="component-composition component-composition-reset"
      onClick={onClick}
      data-playwright-testid={playwrightTestId}
    >
      {c.length === 1 ? (
        <>
          <Loader loading={loading}>
            <Spinner />
          </Loader>

          <Layout className="component-composition-layout" loading={loading}>
            {c[0]}
          </Layout>
        </>
      ) : (
        <>
          <Background className="component-composition-background">{c[0]}</Background>

          <Loader loading={loading}>
            <Spinner />
          </Loader>

          <Layout className="component-composition-layout" loading={loading}>
            {c[1]}
          </Layout>
        </>
      )}
    </Container>
  )
})
