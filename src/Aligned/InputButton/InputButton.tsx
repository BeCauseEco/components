import styled from "@emotion/styled"
import { Children, forwardRef, ReactElement } from "react"
import { EColor } from "@new/Color"
import { ESize } from "@new/ESize"
import { Stack, TStack } from "@new/Aligned/Stack/Stack"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import Link, { LinkProps } from "next/link"
import React from "react"
import { TPlaywright } from "@new/TPlaywright"
import { TIcon } from "@new/Icon/Icon"

const Output = styled.output<Pick<TInputButton, "loading" | "variant">>(p => ({
  display: "flex",
  alignItems: "center",
  alignContent: "center",
  justifyContent: "center",
  border: 0,
  background: "none",
  userSelect: "none",
  textDecorationColor: "inherit",
  width: "fit-content",
  lineHeight: 1,

  "&:focus-visible, &:focus": {
    outline: "none",
    // boxShadow: "0 0 0 2px currentColor",
  },

  "& a p, & p": {
    lineHeight: "inherit",
    textDecoration: p.variant === EInputButtonVariant.Link ? "underline" : "none",

    "&:hover": {
      textDecoration: "none",
    },
  },
}))

const NextLink = styled(Link)({
  textDecoration: "none",
})

const Container = (p: Omit<TInputButtonVariantOthers, "onClick">) => {
  switch (p.variant) {
    case EInputButtonVariant.Solid:
      return (
        <Stack colorBackground={[p.color, 700]} colorBackgroundHover={[p.color, 800]} borderRadius={ESize.Small}>
          {p.label}
        </Stack>
      )

    case EInputButtonVariant.Outlined:
      return (
        <Stack colorOutline={[p.color, 300]} colorBackgroundHover={[p.color, 100]} borderRadius={ESize.Small}>
          {children}
        </Stack>
      )
      break

    case EInputButtonVariant.Transparent:
      return (
        <Stack colorBackgroundHover={[p.color, 100]} borderRadius={ESize.Small}>
          {children}
        </Stack>
      )
  }
}

export enum EInputButtonVariant {
  Solid,
  Outlined,
  Transparent,
  Link,
}

type TInputButtonBase = TPlaywright & {
  size: ESize.Small | ESize.Large
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  collapse?: boolean
  label?: string
  iconName?: string
  iconPlacement: "beforeLabel" | "afterLabel"
}

type TNextLinkHref = LinkProps["href"]

type TInputButtonVariantLink = TInputButtonBase & {
  variant: EInputButtonVariant.Link
  href?: TNextLinkHref
}

type TInputButtonVariantOthers = TInputButtonBase & {
  variant: EInputButtonVariant.Solid | EInputButtonVariant.Outlined | EInputButtonVariant.Transparent
  color: EColor
}

export type TInputButton = TInputButtonVariantLink | TInputButtonVariantOthers | TInputButtonVariantOthers

export const InputButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TInputButton>((p, ref) => {
  return (
    <Output
      ref={ref}
      as={p.variant === EInputButtonVariant.Link ? "span" : "button"}
      variant={p.variant}
      color={p.variant !== EInputButtonVariant.Link ? p.color : EColor.Transparent}
      onClick={p.onClick}
      data-playwright-testid={p.playwrightTestId}
      {...(p as any)}
    >
      {p["href"] ? <NextLink href={p["href"]}>{p.label}</NextLink> : <Container label={p.label} />}
    </Output>
  )
})
