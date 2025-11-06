import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { ReactElement, useId } from "react"
import { PlaywrightProps } from "@new/Playwright"
import { InputRadioGroupItemProps } from "@new/InputRadioGroup/InputRadioGroupItem"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Color } from "@new/Color"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Stack/Spacer"
import { Text } from "@new/Text/Text"
import React from "react"

const Root = styled(RadixRadioGroup.Root)({
  display: "flex",
  flexDirection: "inherit",
})

const Item = styled(RadixRadioGroup.Item)({
  all: "unset",
  display: "flex",
  flexDirection: "row",
  position: "relative",
  cursor: "pointer",
  padding: 0,
  height: "fit-content",

  "&:focus": {
    // boxShadow: "0 0 0 2px currentColor",
  },
})

const Label = styled.label({
  display: "flex",
  cursor: "pointer",
})

export type InputRadioGroupProps = PlaywrightProps & {
  size: "small" | "large"

  color: Color

  defaultValue: string
  value: string

  onChange: (value: string) => void

  label?: string

  children: ReactElement<InputRadioGroupItemProps> | ReactElement<InputRadioGroupItemProps>[]

  disabled?: boolean

  required?: boolean
}

export const InputRadioGroup = (p: InputRadioGroupProps) => {
  const items: ReactElement[] = []
  const key = useId()

  let i = 0

  React.Children.forEach(p.children, child => {
    i = i + 1

    if (React.isValidElement(child)) {
      const renderSpacer = React.Children.count(p.children) > i && p.size === "large"

      items.push(
        <Stack key={i} horizontal hug>
          <Align horizontal left hug>
            <Item id={child.props.value} value={child.props.value}>
              {p.value === child.props.value ? (
                <Icon name="radio_button_checked" large fill={[p.color, 700]} />
              ) : (
                <Icon name="radio_button_unchecked" large style="outlined" fill={[p.color, 300]} />
              )}
            </Item>

            <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

            <Label htmlFor={child.props.value}>
              <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[p.color, 700]}>
                {child.props.label}
              </Text>
            </Label>
          </Align>

          {renderSpacer ? <Spacer tiny /> : <></>}
        </Stack>,
      )
    }
  })

  return (
    <Stack
      vertical
      data-playwright-testid={p["data-playwright-testid"]}
      hug
      className="<InputRadioGroup /> -"
      disabled={p.disabled ? true : undefined}
    >
      {p.label ? (
        <Align vertical left hug="width">
          <Label htmlFor={key}>
            <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[p.color, 700]}>
              <b>{p.label}</b>
            </Text>
            {p.required && (
              <>
                <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />
                <Icon
                  name="asterisk"
                  small={p.size === "small"}
                  medium={p.size === "large"}
                  fill={[Color.Error, 700]}
                />
              </>
            )}
          </Label>

          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
        </Align>
      ) : (
        <></>
      )}

      <Align hug left vertical>
        <Root
          defaultValue={p.defaultValue}
          value={p.value}
          onValueChange={p.onChange}
          data-playwright-test-id={p["data-playwright-testid"]}
        >
          <Stack vertical hug>
            <Align vertical left hug>
              {items}
            </Align>
          </Stack>
        </Root>
      </Align>
    </Stack>
  )
}
