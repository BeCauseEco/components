import { ReactElement } from "react"
import { PlaywrightProps } from "@new/Playwright"
import { Color } from "@new/Color"
import { Stack, StackProps } from "@new/Stack/Stack"
import { Text, TextProps } from "@new/Text/Text"
import { Icon, IconProps } from "@new/Icon/Icon"
import { InputButton, InputButtonProps } from "@new/InputButton/internal/InputButton"
import { Align } from "@new/Stack/Align"
import { Spacer } from "@new/Stack/Spacer"
import styled from "@emotion/styled"
import { ComponentBaseProps } from "@new/ComponentBaseProps"

const Container = styled.div<Pick<BadgeProps, "size">>(p => ({
  display: "flex",
  width: "fit-content",
  height: p.size === "small" ? "calc(var(--BU) * 6)" : "calc(var(--BU) * 8)",

  "& > *": {
    userSelect: "none",
  },
}))

export type BadgeProps = ComponentBaseProps &
  Pick<TextProps, "maxWidth"> &
  PlaywrightProps & {
    disabled?: boolean

    size: "small" | "large"

    variant: "solid" | "outlined" | "opaque" | "transparent"

    label: string

    color: Color
    iconName?: string

    onClear?: () => void
  }

export const Badge = (p: BadgeProps) => {
  let icon: ReactElement<IconProps> | null = null
  let button: ReactElement<InputButtonProps> | null = null
  let stack: ReactElement<StackProps> | null = null

  if (p.iconName) {
    icon = (
      <Align horizontal left hug="width">
        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

        <Icon
          name={p.iconName}
          fill={[p.color, p.variant === "solid" ? 50 : 700]}
          small={p.size === "small"}
          medium={p.size === "large"}
        />

        <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />
      </Align>
    )
  }

  if (p.onClear) {
    button = (
      <Align horizontal right hug="width">
        <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

        <InputButton
          variant="blank"
          width="auto"
          size={p.size}
          colorForeground={[p.color, p.variant === "solid" ? 50 : 700]}
          iconName="close"
          iconPlacement="labelNotSpecified"
          onClick={p.onClear}
          hug
        />

        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
      </Align>
    )
  }

  const children = (
    <>
      {icon}

      <Align horizontal center hug="width">
        {p.iconName ? null : <Spacer xsmall={p.size === "small"} small={p.size === "large"} />}

        <Text
          tiny={p.size === "small"}
          xsmall={p.size !== "small"}
          fill={[p.color, p.variant === "solid" ? 50 : 700]}
          maxWidth={p.maxWidth}
        >
          {p.label}
        </Text>

        {p.onClear ? null : <Spacer xsmall={p.size === "small"} small={p.size === "large"} />}
      </Align>

      {button}
    </>
  )

  switch (p.variant) {
    case "solid":
      stack = (
        <Stack horizontal colorBackground={[p.color, 700]} cornerRadius="medium" disabled={p.disabled} hug>
          {children}
        </Stack>
      )
      break

    case "outlined":
      stack = (
        <Stack horizontal colorOutline={[p.color, 300]} cornerRadius="medium" disabled={p.disabled} hug>
          {children}
        </Stack>
      )
      break

    case "opaque":
      stack = (
        <Stack horizontal colorBackground={[p.color, 100]} cornerRadius="medium" disabled={p.disabled} hug>
          {children}
        </Stack>
      )
      break

    case "transparent":
      stack = (
        <Stack horizontal cornerRadius="medium" disabled={p.disabled} hug>
          {children}
        </Stack>
      )
      break
  }

  return (
    <Container className="<Badge /> -" size={p.size}>
      {stack}
    </Container>
  )
}
