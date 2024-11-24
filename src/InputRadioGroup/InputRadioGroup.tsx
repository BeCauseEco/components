import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { ReactElement } from "react"
import { PlaywrightProps } from "@new/Playwright"
import { InputRadioGroupItemProps } from "@new/InputRadioGroup/InputRadioGroupItem"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Align/Align"
import { Color } from "@new/Color"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"
import { Text } from "@new/Text/Text"
import React from "react"

const Root = styled(RadixRadioGroup.Root)<{ marginPosition: "bottom" | "right" }>(p => ({
  display: "flex",
  flexDirection: "inherit",

  "& > *:not(:last-child)": {
    ...(p.marginPosition === "bottom" && { marginBottom: "var(--BU)" }),
    ...(p.marginPosition === "right" && { marginRight: "calc(var(--BU) * 4)" }),
  },
}))

const Item = styled(RadixRadioGroup.Item)({
  all: "unset",
  display: "flex",
  flexDirection: "row",
  position: "relative",
  cursor: "pointer",

  "&:focus": {
    // boxShadow: "0 0 0 2px currentColor",
  },
})

const Label = styled.label({
  display: "flex",
  cursor: "pointer",
  userSelect: "none",
})

export type InputRadioGroupProps = PlaywrightProps & {
  size: "small" | "large"

  color: Color

  defaultValue: string
  value: string

  onChange: (value: string) => void

  label?: string

  children: ReactElement<InputRadioGroupItemProps> | ReactElement<InputRadioGroupItemProps>[]
}

export const InputRadioGroup = (p: InputRadioGroupProps) => {
  const items: ReactElement[] = []

  React.Children.forEach(p.children, child => {
    if (React.isValidElement(child)) {
      items.push(
        <Align horizontal left hug>
          <Item id={child.props.value} value={child.props.value}>
            {p.value === child.props.value ? (
              <Icon name="radio_button_checked" large fill={[p.color, 700]} />
            ) : (
              <Icon name="radio_button_unchecked" large fill={[p.color, 700]} />
            )}
          </Item>

          <Spacer tiny />

          <Label htmlFor={child.props.value}>
            <Text small={p.size === "small"} medium={p.size !== "small"} fill={[p.color, 700]}>
              {child.props.label}
            </Text>
          </Label>
        </Align>,
      )
    }
  })

  return (
    <Stack vertical playwrightTestId={p.playwrightTestId} hug>
      <Align hug left vertical>
        <Root
          defaultValue={p.defaultValue}
          value={p.value}
          onValueChange={p.onChange}
          data-playwright-test-id={p.playwrightTestId}
          marginPosition={p["vertical"] && !p["horizontal"] ? "bottom" : "right"}
        >
          <Stack vertical hug>
            {items}
          </Stack>
        </Root>
      </Align>
    </Stack>
  )
}
