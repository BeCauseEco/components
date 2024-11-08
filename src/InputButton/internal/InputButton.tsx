import styled from "@emotion/styled"
import { forwardRef, ReactElement } from "react"
import { Color } from "@new/Color"
import { Stack } from "@new/Stack/Stack"
import Link, { LinkProps } from "next/link"
import React from "react"
import { TPlaywright } from "@new/TPlaywright"
import { Text, TText } from "@new/Text/Text"
import { Align, TAlign } from "@new/Align/Align"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"

const computeHeight = (p: TInputButton): string => {
  if (p.size === "small") {
    return "calc(var(--BU) * 8)"
  } else {
    return "calc(var(--BU) * 10)"
  }
}

const Output = styled.output<Pick<TInputButton, "variant"> & { height: string }>(p => ({
  display: "flex",
  border: 0,
  background: "none",
  userSelect: "none",
  textDecorationColor: "inherit",
  width: "fit-content",
  height: p.height,
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
          <Text size={p.size === "small" ? "small" : "medium"} color={[p.color, 700]}>
            {p.label}
          </Text>
        </NextLink>
      )
    } else {
      label = (
        <Align horizontal left hug>
          <Text size={p.size === "small" ? "small" : "medium"} color={[p.color, p.variant === "solid" ? 50 : 700]}>
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
        fill={[p.color, p.variant === "solid" ? 50 : 700]}
        medium={p.size === "small"}
        large={p.size === "large"}
      />
    )

    if (p.iconPlacement === "beforeLabel") {
      iconBeforeLabel = (
        <Align horizontal left hug>
          {icon}

          <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />
        </Align>
      )
    }

    if (p.iconPlacement === "afterLabel") {
      iconAfterLabel = (
        <Align horizontal left hug>
          <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

          {icon}
        </Align>
      )
    }

    if (p.iconPlacement === "labelNotSpecified") {
      iconLabelNotSpecified = (
        <Align horizontal center hug>
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
          colorLoading={[p.color, 50]}
          borderRadius="small"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
          hug={p.hug}
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
          colorLoading={[p.color, 700]}
          borderRadius="small"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
          hug={p.hug}
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
          colorLoading={[p.color, 700]}
          borderRadius="small"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
          hug={p.hug}
        >
          {children}
        </Stack>
      )
  }
}

export type TInputButton = TPlaywright & {
  variant: "link" | "solid" | "outlined" | "transparent"

  size: "small" | "large"

  color: Color

  loading?: boolean
  disabled?: boolean

  label?: string

  iconName?: string
  iconPlacement?: "beforeLabel" | "afterLabel" | "labelNotSpecified"

  hug?: boolean

  href?: LinkProps["href"]
  onClick?: () => void
}

export const InputButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TInputButton>((p, ref) => {
  const { variant, color, onClick, ...pp } = p

  return (
    <Output
      as={variant === "link" ? "span" : "button"}
      // @ts-expect-error TypeScript can't infer the type of the `ref` prop when using as="...".
      ref={ref}
      variant={variant}
      color={color}
      onClick={onClick}
      data-playwright-testid={p.playwrightTestId}
      height={computeHeight(p)}
      {...pp}
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
        hug={p.hug}
      />
    </Output>
  )
})
