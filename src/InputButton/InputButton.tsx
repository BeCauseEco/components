import styled from "@emotion/styled"
import { TIcon } from "@new/Icon/Icon"
import { PropsWithChildren, ReactElement, forwardRef } from "react"
import { EColor } from "@new/Color"
import { TText } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { TKeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutInputButton } from "./LayoutInputButton"
import Link, { LinkProps } from "next/link"
import React from "react"

const Output = styled.output<Pick<TInputButton, "loading" | "variant">>(p => ({
  display: "flex",
  alignItems: "center",
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

  ...(p.loading
    ? {
        opacity: 0.5,
        pointerEvents: "none",
      }
    : null),
}))

const NextLink = styled(Link)({
  textDecoration: "none",
})

export enum EInputButtonVariant {
  Solid,
  Outlined,
  Transparent,
  Link,
}

type TInputButtonBase = {
  size: ESize.Small | ESize.Medium | ESize.Large
  onClick?: () => void
  loading?: boolean
  children: ReactElement<TText | TIcon | TKeyValuePair>
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

export const InputButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, PropsWithChildren<TInputButton>>(
  (props, ref) => {
    const {
      variant,
      loading = false,
      size,
      onClick,
      // @ts-expect-error TypeScript is not smart enough to accept discriminating unions in this case
      href,
      children,
    } = props

    const childIconOnly = React.Children.toArray(children)[0]["type"]["name"] === "Icon"

    let background

    switch (variant) {
      case EInputButtonVariant.Solid:
        background = (
          <BackgroundCard
            colorBackground={[props.color, 700]}
            colorBackgroundHover={[props.color, 900]}
            borderRadius={ESize.Tiny}
          />
        )
        break

      case EInputButtonVariant.Outlined:
        background = (
          <BackgroundCard
            colorOutline={[props.color, 700]}
            colorBackgroundHover={[props.color, 100]}
            borderRadius={ESize.Tiny}
          />
        )
        break

      case EInputButtonVariant.Transparent:
        background = <BackgroundCard borderRadius={ESize.Tiny} colorBackgroundHover={[props.color, 100]} />
        break
    }

    const Layout = <LayoutInputButton childIconOnly={childIconOnly} content={children} size={size} />

    return (
      <Output
        ref={ref}
        as={variant === EInputButtonVariant.Link ? "span" : "button"}
        variant={variant}
        color={variant !== EInputButtonVariant.Link ? props.color : EColor.Transparent}
        loading={loading}
        onClick={onClick}
        {...(props as any)}
      >
        <Composition>
          {background}

          {href ? <NextLink href={href}>{Layout}</NextLink> : Layout}
        </Composition>
      </Output>
    )
  },
)
