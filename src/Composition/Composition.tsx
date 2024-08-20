import React, { PropsWithChildren, ReactElement, forwardRef } from "react"
import styled from "@emotion/styled"
import { TBackgroundCard } from "@new/Composition/BackgroundCard"
import { TLayoutSingle } from "@new/Composition/LayoutSingle"
import { TLayoutSplit } from "@new/Composition/LayoutSplit"
import { TLayoutThirds } from "@new/Composition/LayoutThirds"
import { TLayoutGrid } from "@new/Composition/LayoutGrid"
import { TLayoutBase } from "./TLayoutBase"

const Container = styled.div<Pick<TComposition, "loading" | "explodeHeight" | "overflowHidden">>(p => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderRadius: "inherit",
  width: "100%",
  height: p.explodeHeight ? "100%" : "auto",
  opacity: p.loading ? 0.5 : 1,
  cursor: p.loading ? "loading" : "auto",
  overflow: p.overflowHidden ? "hidden" : "auto",
}))

const Background = styled.div({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 0,
})

const Layout = styled.div<Pick<TComposition, "loading">>(p => ({
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  height: "inherit",

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
}

export const Composition = forwardRef<HTMLDivElement, PropsWithChildren<TComposition>>((props, ref) => {
  const { children, loading = false, explodeHeight = false, overflowHidden = false } = props

  const childrenArray = React.Children.toArray(children)

  let background = childrenArray[0]
  let layout = childrenArray[1]

  // @ts-expect-error type.name is available - it's just not exposed through type: React.ReactNode
  if (background?.type?.name?.lastIndexOf("Background") === -1) {
    layout = childrenArray[0]
    background = <></>
  }

  return (
    <Container
      ref={ref}
      loading={loading}
      explodeHeight={explodeHeight}
      overflowHidden={overflowHidden}
      className="component-composition component-composition-reset"
    >
      {background && <Background className="component-composition-background">{background}</Background>}

      {layout && <Layout className="component-composition-layout">{layout}</Layout>}
    </Container>
  )
})
