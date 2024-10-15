import styled from "@emotion/styled"
import { TIcon } from "@new/Icon/Icon"
import { PropsWithChildren, ReactElement, forwardRef } from "react"
import { EColor } from "@new/Color"
import { TText } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutInputButton } from "./internal/LayoutInputButton"
import Link, { LinkProps } from "next/link"
import React from "react"
import { TSpacer } from "@new/Spacer/Spacer"
import { TPlaywright } from "@new/TPlaywright"
import { TColor } from "@new/Color"

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

type TInputButtonBase = TPlaywright & {
  size: ESize.Small | ESize.Medium | ESize.Large
  id?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  omitPadding?: boolean
  children:
    | ReactElement<TText | TIcon>
    | [ReactElement<TText>, ReactElement<TSpacer>, ReactElement<TIcon>]
    | [ReactElement<TIcon>, ReactElement<TSpacer>, ReactElement<TText>]
}

type TNextLinkHref = LinkProps["href"]

type TInputButtonVariantLink = TInputButtonBase & {
  variant: EInputButtonVariant.Link
  href?: TNextLinkHref
}

type TInputButtonVariantOthers = TInputButtonBase & {
  variant: EInputButtonVariant.Solid | EInputButtonVariant.Outlined | EInputButtonVariant.Transparent
  color: EColor
  outlineColor?: TColor
  colorBackgroundHover?: TColor
}

export type TInputButton = TInputButtonVariantLink | TInputButtonVariantOthers | TInputButtonVariantOthers

export const InputButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, PropsWithChildren<TInputButton>>(
  (props, ref) => {
    const {
      variant,
      loading = false,
      disabled = false,
      omitPadding = false,
      size,
      id,
      onClick,
      // @ts-expect-error TypeScript is not smart enough to accept discriminating unions in this case
      href,
      children,
      playwrightTestId,
    } = props

    const childIconOnly = React.Children.toArray(children)[0]["type"]["name"] === "Icon"

    let background

    switch (variant) {
      case EInputButtonVariant.Solid:
        background = (
          <BackgroundCard
            colorBackground={[props.color, 700]}
            colorBackgroundHover={[props.color, 800]}
            borderRadius={ESize.Tiny}
          />
        )
        break

      case EInputButtonVariant.Outlined:
        background = (
          <BackgroundCard
            colorOutline={props.outlineColor ?? [props.color, 700]}
            colorBackgroundHover={props.colorBackgroundHover ?? [props.color, 100]}
            borderRadius={ESize.Tiny}
          />
        )
        break

      case EInputButtonVariant.Transparent:
        background = <BackgroundCard borderRadius={ESize.Tiny} colorBackgroundHover={[props.color, 100]} />
        break
    }

    const Layout = (
      <LayoutInputButton childIconOnly={childIconOnly} content={children} size={size} omitPadding={omitPadding} />
    )

    return (
      <Output
        ref={ref}
        as={variant === EInputButtonVariant.Link ? "span" : "button"}
        variant={variant}
        color={variant !== EInputButtonVariant.Link ? props.color : EColor.Transparent}
        id={id}
        onClick={onClick}
        data-playwright-testid={playwrightTestId}
        {...(props as any)}
      >
        <Composition loading={loading} disabled={disabled}>
          {background}

          {href ? <NextLink href={href}>{Layout}</NextLink> : Layout}
        </Composition>
      </Output>
    )
  },
)
