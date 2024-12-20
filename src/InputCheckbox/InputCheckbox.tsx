import styled from "@emotion/styled"
import { Color } from "@new/Color"
import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { Icon } from "@new/Icon/Icon"
import { Text, TextProps } from "@new/Text/Text"
import { useId } from "react"
import { Stack } from "@new/Stack/Stack"
import { Spacer } from "@new/Stack/Spacer"
import { Align } from "@new/Stack/Align"
import { ComponentBaseProps } from "@new/ComponentBaseProps"

const Container = styled.div({
  display: "flex",

  "& button": {
    all: "unset",
    display: "flex",
    cursor: "pointer",
  },
})

const Root = styled(RadixCheckbox.Root)({
  display: "flex",

  "&:focus": {
    // boxShadow: "0 0 0 2px currentColor",
  },
})

const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
})

export type InputCheckboxProps = ComponentBaseProps &
  Pick<TextProps, "maxWidth"> & {
    size: "small" | "large"

    color: Color

    label?: string

    value: boolean | "indeterminate"

    onChange: (value: boolean) => void

    disabled?: boolean

    alternateAppearance?: boolean
  }

export const InputCheckbox = (p: InputCheckboxProps) => {
  const key = useId()

  return (
    <Container className="<InputCheckbox /> -" data-playwright-testid={p.playwrightTestId}>
      <Stack horizontal hug disabled={p.disabled ? true : undefined}>
        <Align horizontal left hug>
          <Root id={key} checked={p.value} onCheckedChange={checked => p.onChange(checked === true)}>
            {p.value === "indeterminate" && (
              <Icon
                name={p.alternateAppearance ? "radio_button_partial" : "indeterminate_check_box"}
                large
                fill={[p.color, 700]}
              />
            )}

            {p.value === true && (
              <Icon name={p.alternateAppearance ? "radio_button_checked" : "check_box"} large fill={[p.color, 700]} />
            )}

            {p.value === false && (
              <Icon
                name={p.alternateAppearance ? "radio_button_unchecked" : "check_box_outline_blank"}
                large
                style="outlined"
                fill={[p.color, 300]}
              />
            )}
          </Root>

          {p.label && (
            <>
              <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

              <Label htmlFor={key}>
                <Text
                  xsmall={p.size === "small"}
                  small={p.size !== "small"}
                  fill={[Color.Neutral, 700]}
                  maxWidth={p.maxWidth}
                >
                  {p.label}
                </Text>
              </Label>
            </>
          )}
        </Align>
      </Stack>
    </Container>
  )
}
