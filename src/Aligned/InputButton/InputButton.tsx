import styled from "@emotion/styled"
import { forwardRef, ReactElement } from "react"
import { EColor } from "@new/Color"
import { ESize } from "@new/ESize"
import { Stack } from "@new/Aligned/Stack/Stack"
import Link, { LinkProps } from "next/link"
import React from "react"
import { TPlaywright } from "@new/TPlaywright"
import { Text, TText } from "@new/Text/Text"
import { Align, TAlign } from "@new/Aligned/Align/Align"
import { Icon } from "@new/Aligned/Icon/Icon"
import { Spacer } from "../Spacer/Spacer"

const Output = styled.output<Pick<TInputButton, "variant">>(p => ({
  display: "flex",
  border: 0,
  background: "none",
  userSelect: "none",
  textDecorationColor: "inherit",
  width: "fit-content",
  lineHeight: 1,
  cursor: "pointer",

  "&:focus-visible, &:focus": {
    outline: "none",
    // boxShadow: "0 0 0 2px currentColor",
  },

  "& a p, & p": {
    lineHeight: "inherit",
    textDecoration: p.variant === "link" ? "underline" : "none",

    "&:hover": {
      textDecoration: "none",
    },
  },
}))

const NextLink = styled(Link)({
  textDecoration: "none",
})

const Children = (p: Omit<TInputButton, "onClick">) => {
  let label: ReactElement<TText | TAlign> | null = null
  let iconBeforeLabel: ReactElement<TAlign> | null = null
  let iconAfterLabel: ReactElement | null = null
  let iconLabelNotSpecified: ReactElement | null = null

  if (p.label) {
    if (p.variant === "link" && p.href) {
      return (
        <NextLink href={p.href}>
          <Text size={p.size === ESize.Small ? ESize.Small : ESize.Medium} color={[p.color, 700]}>
            {p.label}
          </Text>
        </NextLink>
      )
    } else {
      label = (
        <Align horizontal left collapse>
          <Text
            size={p.size === ESize.Small ? ESize.Small : ESize.Medium}
            color={[p.color, p.variant === "solid" ? 50 : 700]}
          >
            {p.label}
          </Text>
        </Align>
      )
    }
  }

  if (p.iconName) {
    const icon = (
      <Icon
        name={p.iconName}
        size={p.size === ESize.Small ? ESize.Medium : ESize.Large}
        color={[p.color, p.variant === "solid" ? 50 : 700]}
      />
    )

    if (p.iconPlacement === "beforeLabel") {
      iconBeforeLabel = (
        <Align horizontal left collapse>
          {icon}

          <Spacer tiny={p.size === ESize.Small} xsmall={p.size === ESize.Large} />
        </Align>
      )
    }

    if (p.iconPlacement === "afterLabel") {
      iconAfterLabel = (
        <Align horizontal left collapse>
          <Spacer tiny={p.size === ESize.Small} xsmall={p.size === ESize.Large} />

          {icon}
        </Align>
      )
    }

    if (p.iconPlacement === "labelNotSpecified") {
      iconLabelNotSpecified = (
        <Align horizontal center collapse>
          {icon}
        </Align>
      )
    }
  }

  const children = (
    <>
      {iconBeforeLabel}
      {label}
      {iconAfterLabel}
      {iconLabelNotSpecified}
    </>
  )

  switch (p.variant) {
    case "link":
      if (p.href) {
        return <NextLink href={p.href}>{label}</NextLink>
      } else {
        return null
      }

    case "solid":
      return (
        <Stack
          horizontal
          colorBackground={[p.color, 700]}
          colorBackgroundHover={[p.color, 800]}
          colorLoading={p.color}
          borderRadius={ESize.Small}
          collapse="partly"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
        >
          {children}
        </Stack>
      )

    case "outlined":
      return (
        <Stack
          horizontal
          colorOutline={[p.color, 300]}
          colorBackgroundHover={[p.color, 100]}
          colorLoading={p.color}
          borderRadius={ESize.Small}
          collapse="partly"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
        >
          {children}
        </Stack>
      )
      break

    case "transparent":
      return (
        <Stack
          horizontal
          colorBackgroundHover={[p.color, 100]}
          colorLoading={p.color}
          borderRadius={ESize.Small}
          collapse="partly"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
        >
          {children}
        </Stack>
      )
  }
}

type TInputButton = TPlaywright & {
  variant: "link" | "solid" | "outlined" | "transparent"

  size: ESize.Small | ESize.Large
  color: EColor

  href?: LinkProps["href"]
  onClick?: () => void

  loading?: boolean
  disabled?: boolean

  label?: string
  iconName?: string
  iconPlacement?: "beforeLabel" | "afterLabel" | "labelNotSpecified"

  collapse?: boolean
}

export const InputButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TInputButton>((p, ref) => {
  return (
    <Output
      ref={ref}
      as={p.variant === "link" ? "span" : "button"}
      variant={p.variant}
      color={p.color}
      onClick={p.onClick}
      data-playwright-testid={p.playwrightTestId}
      {...(p as any)}
    >
      <Children
        variant={p.variant}
        size={p.size}
        color={p.color}
        href={p.href}
        loading={p.loading}
        disabled={p.disabled}
        label={p.label}
        iconName={p.iconName}
        iconPlacement={p.iconPlacement}
        collapse={p.collapse}
      />
    </Output>
  )
})
