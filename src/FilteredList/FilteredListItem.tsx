import { Avatar, AvatarProps } from "@new/Avatar/Avatar"
import { PlaywrightProps } from "@new/Playwright"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Spacer } from "@new/Stack/Spacer"
import { Text } from "@new/Text/Text"
import React from "react"
import styled from "@emotion/styled"
import { CommandItem } from "cmdk"
import { Color, ColorWithLightness, computeColor } from "@new/Color"

const Container = styled(CommandItem)<{
  selected: boolean
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
  colorForeground: ColorWithLightness
}>(p => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "calc(var(--BU) * 2)",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "transparent",

  "&[data-selected='true']": {
    backgroundColor: computeColor(p.colorBackgroundHover),
  },
}))

export type FilteredListItemElementProps = PlaywrightProps &
  AvatarProps & {
    value: string
    label: string
    onChange: (value: string) => void
    color: Color
  }

export const FilteredListItem = ({
  value,
  label,
  onChange,
  src,
  title,
  color,
  "data-playwright-testid": playwrightTestId,
}: FilteredListItemElementProps) => {
  return (
    <Container
      value={value}
      onSelect={value => onChange(value)}
      selected={value === value}
      colorSelected={[color, 400]}
      colorBackgroundHover={[color, 50]}
      colorForeground={[color, 700]}
      data-playwright-testid={playwrightTestId}
    >
      <Stack horizontal hug>
        <Align horizontal left hug>
          <Avatar size="large" src={src} title={title} />
        </Align>

        <Spacer xsmall />

        <Align horizontal left>
          <Text small fill={[color, 700]}>
            {label}
          </Text>
        </Align>
      </Stack>
    </Container>
  )
}
