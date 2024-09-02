import React, { PropsWithChildren, ReactElement, forwardRef } from "react"
import styled from "@emotion/styled"
import { TBackgroundCard } from "@new/Composition/BackgroundCard"
import { TLayoutSingle } from "@new/Composition/LayoutSingle"
import { TLayoutSplit } from "@new/Composition/LayoutSplit"
import { TLayoutThirds } from "@new/Composition/LayoutThirds"
import { TLayoutGrid } from "@new/Composition/LayoutGrid"
import { TLayoutBase } from "./TLayoutBase"

const Container = styled.div<Pick<TComposition, "loading" | "explodeHeight" | "overflowHidden" | "onClick">>(p => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderRadius: "inherit",
  width: "100%",
  height: p.explodeHeight ? "100%" : "auto",
  opacity: p.loading ? 0.5 : 1,
  cursor: p.loading ? "loading" : p.onClick ? "pointer" : "auto",
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

const Layout = styled.div<Pick<TComposition, "loading">>(p => ({
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  height: "inherit",
  cursor: "inherit",

  ...(p.loading
    ? {
        pointerEvents: "none",
        opacity: 0.5,
      }
    : {}),
}))

type AllowedBackgrounds = TBackgroundCard

type TAllowedLayouts = TLayoutSingle | TLayoutSplit | TLayoutThirds | TLayoutGrid | TLayoutBase

export type TComposition = {
  children: ReactElement<TAllowedLayouts> | [ReactElement<AllowedBackgrounds>, ReactElement<TAllowedLayouts>]
  loading?: boolean
  explodeHeight?: boolean
  overflowHidden?: boolean
  onClick?: () => void
}

export const Composition = forwardRef<HTMLDivElement, PropsWithChildren<TComposition>>((props, ref) => {
  const { children, loading = false, explodeHeight = false, overflowHidden = false, onClick } = props

  const c = React.Children.toArray(children)

  return (
    <Container
      ref={ref}
      loading={loading}
      explodeHeight={explodeHeight}
      overflowHidden={overflowHidden}
      className="component-composition component-composition-reset"
      onClick={onClick}
    >
      {c.length === 1 ? (
        <>
          <Layout className="component-composition-layout">{c[0]}</Layout>
        </>
      ) : (
        <>
          <Background className="component-composition-background">{c[0]}</Background>

          <Layout className="component-composition-layout">{c[1]}</Layout>
        </>
      )}
    </Container>
  )
})
