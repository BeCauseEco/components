import styled from "@emotion/styled"
import { forwardRef, ReactElement } from "react"
import { Color } from "@new/Color"
import { Stack } from "@new/Stack/Stack"
import Link, { LinkProps } from "next/link"
import React from "react"
import { Playwright } from "@new/Playwright"
import { Text, TextProps } from "@new/Text/Text"
import { Align, AlignProps } from "@new/Align/Align"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"

const computeHeight = (p: InputButtonProps): string => {
  if (p.size === "small") {
    return "calc(var(--BU) * 8)"
  } else {
    return "calc(var(--BU) * 10)"
  }
}

const Output = styled.output<Pick<InputButtonProps, "variant"> & { height: string }>(p => ({
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

const Children = (p: Omit<InputButtonProps, "onClick">) => {
  let label: ReactElement<TextProps | AlignProps> | null = null
  let iconBeforeLabel: ReactElement<AlignProps> | null = null
  let iconAfterLabel: ReactElement | null = null
  let iconLabelNotSpecified: ReactElement | null = null

  if (p.label) {
    if (p.variant === "link" && p.href) {
      label = <></>
    } else {
      label = (
        <Align horizontal left>
          <Text
            small={p.size === "small"}
            medium={p.size !== "small"}
            fill={[p.color, p.variant === "solid" ? 50 : 700]}
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
        fill={[p.color, p.variant === "solid" ? 50 : 700]}
        medium={p.size === "small"}
        large={p.size === "large"}
      />
    )

    if (p.iconPlacement === "beforeLabel") {
      iconBeforeLabel = (
        <Align horizontal left>
          {icon}

          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
        </Align>
      )
    }

    if (p.iconPlacement === "afterLabel") {
      iconAfterLabel = (
        <Align horizontal right>
          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

          {icon}
        </Align>
      )
    }

    if (p.iconPlacement === "labelNotSpecified") {
      iconLabelNotSpecified = (
        <Align horizontal center>
          {icon}
        </Align>
      )
    }
  }

  const children = (
    <>
      {!iconLabelNotSpecified && <Spacer xsmall={p.size === "small"} small={p.size === "large"} />}

      {iconBeforeLabel}
      {label}
      {iconAfterLabel}
      {iconLabelNotSpecified}

      {!iconLabelNotSpecified && <Spacer xsmall={p.size === "small"} small={p.size === "large"} />}
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
          cornerRadius="small"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
          hug
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
          cornerRadius="small"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
          hug
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
          cornerRadius="small"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
          hug
        >
          {children}
        </Stack>
      )
  }
}

export type InputButtonProps = Playwright & {
  id?: string

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

  destructive?: boolean
}

export const InputButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, InputButtonProps>((p, ref) => {
  const { id, variant, color, destructive, onClick, playwrightTestId, ...pp } = p

  return (
    <Output
      id={id}
      as={variant === "link" ? "span" : "button"}
      // @ts-expect-error TypeScript can't infer the type of the `ref` prop when using as="...".
      ref={ref}
      variant={variant}
      color={destructive === true ? Color.Error : color}
      onClick={onClick}
      data-playwright-testid={playwrightTestId}
      height={computeHeight(p)}
      {...pp}
    >
      <Children
        variant={variant}
        size={p.size}
        color={destructive === true ? Color.Error : color}
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
