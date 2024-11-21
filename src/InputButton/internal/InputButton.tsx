import styled from "@emotion/styled"
import { forwardRef, ReactElement } from "react"
import { Color } from "@new/Color"
import { Stack } from "@new/Stack/Stack"
import Link, { LinkProps } from "next/link"
import React from "react"
import { PlaywrightProps } from "@new/Playwright"
import { Text, TextProps } from "@new/Text/Text"
import { Align, AlignProps } from "@new/Align/Align"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"
import { useRouter } from "next/router"

const computeHeight = (p: InputButtonProps): string => {
  if (p.size === "small") {
    return "calc(var(--BU) * 8)"
  } else {
    return "calc(var(--BU) * 10)"
  }
}

const Output = styled.output<InputButtonProps>(p => ({
  display: "flex",
  border: 0,
  background: "none",
  userSelect: "none",
  textDecorationColor: "inherit",
  width: "fit-content",
  height: computeHeight(p),
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

const Children = (p: InputButtonProps) => {
  let label: ReactElement<TextProps | AlignProps> | null = null
  let iconBeforeLabel: ReactElement<AlignProps> | null = null
  let iconAfterLabel: ReactElement | null = null
  let iconLabelNotSpecified: ReactElement | null = null

  if (p.label) {
    if (p.variant === "link") {
      label = (
        <Align horizontal left>
          <Text small={p.size === "small"} medium={p.size !== "small"} fill={[p.color, 700]}>
            {p.label}
          </Text>
        </Align>
      )
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
        fill={[p.color, p.variant === "solid" || p.variant === "blank" ? 50 : 700]}
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
        return <a onClick={p.onClick}>{label}</a>
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
          explodeHeight
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
          explodeHeight
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
          explodeHeight
          hug
        >
          {children}
        </Stack>
      )

    case "blank":
      return (
        <Stack
          horizontal
          colorLoading={[p.color, 700]}
          cornerRadius="small"
          loading={p.loading}
          disabled={p.disabled}
          aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
          explodeHeight
          hug
        >
          {children}
        </Stack>
      )
  }
}

export type InputButtonProps = PlaywrightProps & {
  id?: string

  variant: "link" | "solid" | "outlined" | "transparent" | "blank"

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
  const router = useRouter()

  const click = () => {
    if (p.href) {
      router.push(p.href)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <Output
      // @ts-expect-error TypeScript can't infer the type of the `ref` prop when using as="...".
      ref={ref}
      id={id}
      as={variant === "link" ? "span" : "button"}
      variant={variant}
      onClick={click}
      height={computeHeight(p)}
      data-playwright-testid={playwrightTestId}
      {...pp}
    >
      <Children
        variant={variant}
        size={p.size}
        color={destructive === true ? Color.Error : color}
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
