import styled from "@emotion/styled"
import { forwardRef, HTMLAttributeAnchorTarget, ReactElement } from "react"
import { Color, ColorWithLightness, replaceColorComponent } from "@new/Color"
import { Stack, StackProps } from "@new/Stack/Stack"
import Link, { LinkProps } from "next/link"
import React from "react"
import { PlaywrightProps } from "@new/Playwright"
import { Text, TextProps } from "@new/Text/Text"
import { Align, AlignProps } from "@new/Stack/Align"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Stack/Spacer"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { useRouter } from "next/router"

export type InputButtonProps = ComponentBaseProps &
  PlaywrightProps & {
    variant: "link" | "solid" | "outlined" | "transparent" | "blank"

    size: "small" | "large"

    width: "auto" | "half" | "full"

    colorForeground: ColorWithLightness
    colorBackground?: ColorWithLightness
    colorBackgroundHover?: ColorWithLightness
    colorOutline?: ColorWithLightness
    colorOutlineHover?: ColorWithLightness
    colorLoading?: ColorWithLightness

    loading?: boolean
    disabled?: boolean

    label?: string

    iconName?: string
    iconPlacement?: "beforeLabel" | "afterLabel" | "labelNotSpecified"

    hug?: boolean

    href?: LinkProps["href"]
    target?: HTMLAttributeAnchorTarget
    onClick?: () => void
    preventDefault?: boolean

    destructive?: boolean

    content?: ReactElement<StackProps> | null | undefined

    title?: string
  }

const computeHeight = (p: InputButtonProps): string => {
  if (p.size === "small") {
    return "calc(var(--BU) * 8)"
  } else {
    return "calc(var(--BU) * 10)"
  }
}

const computeColorDestructive = (
  colorWithLightness?: ColorWithLightness,
  destructive?: boolean,
): ColorWithLightness | undefined => {
  if (colorWithLightness && colorWithLightness.length === 2) {
    return replaceColorComponent(colorWithLightness, destructive ? Color.Error : (colorWithLightness[0] as Color))
  } else {
    return undefined
  }
}

const Output = styled.output<InputButtonProps & { _width: string; hug: boolean }>(p => ({
  display: "flex",
  border: 0,
  background: "none",
  userSelect: "none",
  textDecorationColor: "inherit",
  width: p._width === "auto" ? "fit-content" : p._width === "half" ? "50%" : "100%",
  height: p.hug ? "fit-content" : computeHeight(p),
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

const Children = (p: Omit<InputButtonProps, "width">) => {
  let label: ReactElement<TextProps | AlignProps> | null = null
  let iconBeforeLabel: ReactElement<AlignProps> | null = null
  let iconAfterLabel: ReactElement | null = null
  let iconLabelNotSpecified: ReactElement | null = null

  if (p.label) {
    if (p.variant === "link") {
      label = (
        <Align horizontal left>
          <Text xsmall={p.size === "small"} small={p.size === "large"} fill={p.colorForeground}>
            {p.label}
          </Text>
        </Align>
      )
    } else {
      label = (
        <Align horizontal left>
          <Text xsmall={p.size === "small"} small={p.size === "large"} fill={p.colorForeground}>
            {p.label}
          </Text>
        </Align>
      )
    }
  }

  if (p.iconName) {
    const icon = (
      <Icon name={p.iconName} fill={p.colorForeground} small={p.size === "small"} medium={p.size === "large"} />
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
    <Stack
      horizontal
      fill={p.colorBackground}
      fillHover={p.colorBackgroundHover}
      stroke={p.colorOutline}
      strokeHover={p.colorOutlineHover}
      fillLoading={p.colorLoading}
      cornerRadius="medium"
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      aspectRatio={p.iconPlacement === "labelNotSpecified" ? "1" : "auto"}
      explodeHeight
      hug
    >
      <>
        {!iconLabelNotSpecified && p.variant !== "link" && (
          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
        )}

        {iconBeforeLabel}
        {label}

        {p.content ? (
          <Align horizontal center>
            {p.content}
          </Align>
        ) : (
          <></>
        )}

        {iconAfterLabel}
        {iconLabelNotSpecified}

        {!iconLabelNotSpecified && p.variant !== "link" && (
          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
        )}
      </>
    </Stack>
  )

  if (p.variant === "link") {
    if (p.href) {
      return (
        <NextLink href={p.href} target={p.target} passHref>
          {children}
        </NextLink>
      )
    } else {
      return (
        <a
          onMouseDown={event => {
            if (p.preventDefault) {
              event.preventDefault()
            }
          }}
          onClick={p.onClick}
        >
          {children}
        </a>
      )
    }
  } else {
    return children
  }
}

export const InputButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, InputButtonProps>((p, ref) => {
  const { id, variant, onClick, href, width, disabled, ...pp } = p
  const router = useRouter()

  const click =
    href && variant !== "link"
      ? () => {
        router.push(href)
      }
      : onClick

  return (
    <Output
      // @ts-expect-error TypeScript can't infer the type of the `ref` prop when using as="..."
      ref={ref}
      id={id}
      as={variant === "link" ? "span" : "div"} // TO-DO: @cllpse: should render a button, but React is retarded
      variant={variant}
      onMouseDown={event => {
        if (p.preventDefault && !disabled) {
          event.preventDefault()

          if (click) {
            click()
          }
        }
      }}
      onClick={disabled ? () => { } : click}
      _width={width}
      _height={computeHeight(p)}
      data-playwright-testid={p["data-playwright-testid"]}
      title={p.title}
      {...pp}
    >
      <Children
        variant={variant}
        size={p.size}
        loading={p.loading}
        disabled={p.disabled ? true : undefined}
        label={p.label}
        iconName={p.iconName}
        iconPlacement={p.iconPlacement}
        colorForeground={computeColorDestructive(p.colorForeground, p.destructive) || p.colorForeground}
        colorBackground={computeColorDestructive(p.colorBackground, p.destructive)}
        colorBackgroundHover={computeColorDestructive(p.colorBackgroundHover, p.destructive)}
        colorOutline={computeColorDestructive(p.colorOutline, p.destructive)}
        colorOutlineHover={computeColorDestructive(p.colorOutlineHover, p.destructive)}
        colorLoading={p.colorLoading}
        content={p.content}
        hug={p.hug}
        href={p.href}
        target={p.target}
      />
    </Output>
  )
})
