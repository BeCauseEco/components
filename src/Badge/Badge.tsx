import { ReactElement } from "react"
import { PlaywrightProps } from "@new/Playwright"
import { Color } from "@new/Color"
import { Stack } from "@new/Stack/Stack"
import { Text } from "@new/Text/Text"
import { Icon, IconProps } from "@new/Icon/Icon"
import { InputButton, InputButtonProps } from "@new/InputButton/internal/InputButton"
import { Align } from "@new/Align/Align"
import { Spacer } from "@new/Spacer/Spacer"
import styled from "@emotion/styled"

const Container = styled.div<Pick<BadgeProps, "size">>(p => ({
  display: "flex",
  width: "fit-content",
  height: p.size === "small" ? "calc(var(--BU) * 6)" : "calc(var(--BU) * 8)",

  "& > *": {
    userSelect: "none",
  },
}))

export type BadgeProps = PlaywrightProps & {
  disabled?: boolean

  size: "small" | "large"

  variant: "solid" | "outlined" | "transparent"

  label: string

  title?: string

  color: Color
  iconName?: string

  onClear?: () => void
}

export const Badge = (p: BadgeProps) => {
  let icon: ReactElement<IconProps> | null = null
  let button: ReactElement<InputButtonProps> | null = null

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

        <Text tiny={p.size === "small"} xsmall={p.size !== "small"} fill={[p.color, p.variant === "solid" ? 50 : 700]}>
          {p.label}
        </Text>

        {p.onClear ? null : <Spacer xsmall={p.size === "small"} small={p.size === "large"} />}
      </Align>

      {button}
    </>
  )

  switch (p.variant) {
    case "solid":
      return (
        <Container size={p.size} title={p.title}>
          <Stack horizontal colorBackground={[p.color, 700]} cornerRadius="medium" disabled={p.disabled} hug>
            {children}
          </Stack>
        </Container>
      )

    case "outlined":
      return (
        <Container size={p.size} title={p.title}>
          <Stack horizontal colorOutline={[p.color, 300]} cornerRadius="medium" disabled={p.disabled} hug>
            {children}
          </Stack>
        </Container>
      )
      break

    case "transparent":
      return (
        <Container size={p.size} title={p.title}>
          <Stack horizontal colorBackground={[p.color, 100]} cornerRadius="medium" disabled={p.disabled} hug>
            {children}
          </Stack>
        </Container>
      )
  }
}
