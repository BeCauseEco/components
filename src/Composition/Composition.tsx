import React, { PropsWithChildren, ReactElement, forwardRef } from "react"
import styled from "@emotion/styled"
import { TBackgroundCard } from "@new/Composition/BackgroundCard"
import { TLayoutSingle } from "@new/Composition/LayoutSingle"
import { TLayoutSplit } from "@new/Composition/LayoutSplit"
import { TLayoutThirds } from "@new/Composition/LayoutThirds"
import { TLayoutGrid } from "@new/Composition/LayoutGrid"
import { TLayoutBase } from "./TLayoutBase"

const Container = styled.div<Pick<TComposition, "loading">>(p => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderRadius: "inherit",
  width: "100%",
  opacity: p.loading ? 0.5 : 1,
  cursor: p.loading ? "loading" : "auto",
  outline: "solid 2px cyan",
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
}

export const Composition = forwardRef<HTMLDivElement, PropsWithChildren<TComposition>>((props, ref) => {
  const { children, loading = false } = props

  const childrenArray = React.Children.toArray(children)

  if (childrenArray.length === 1) {
    return (
      <Container ref={ref} loading={loading} className="component-composition component-composition-reset">
        <Layout className="component-composition-layout">{childrenArray[0]}</Layout>
      </Container>
    )
  } else {
    return (
      <Container ref={ref} loading={loading} className="component-composition component-composition-reset">
        <Background className="component-composition-background">{childrenArray[0]}</Background>

        <Layout className="component-composition-layout">{childrenArray[1]}</Layout>
      </Container>
    )
  }
})
