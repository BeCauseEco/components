import styled from "@emotion/styled"
import { Color } from "@new/Color"
import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { Icon } from "@new/Icon/Icon"
import { Text } from "@new/Text/Text"
import { useId } from "react"
import { PlaywrightProps } from "@new/Playwright"
import { Stack } from "@new/Stack/Stack"
import { Spacer } from "@new/Spacer/Spacer"
import { Align } from "@new/Align/Align"

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

export type InputCheckboxProps = PlaywrightProps & {
  size: "small" | "large"

  color: Color

  label?: string

  value: boolean | "indeterminate"

  onChange: (value: boolean) => void
}

export const InputCheckbox = (p: InputCheckboxProps) => {
  const key = useId()

  return (
    <Container>
      <Stack horizontal hug>
        <Align horizontal left hug>
          <Root id={key} checked={p.value} onCheckedChange={checked => p.onChange(checked === true)}>
            {p.value === "indeterminate" && <Icon name="indeterminate_check_box" large fill={[p.color, 700]} />}

            {p.value === true && <Icon name="check_box" large fill={[p.color, 700]} />}

            {p.value === false && <Icon name="check_box_outline_blank" large fill={[p.color, 700]} />}
          </Root>

          {p.label && (
            <>
              <Spacer tiny />

              <Label htmlFor={key}>
                <Text small={p.size === "small"} medium={p.size !== "small"} fill={[p.color, 700]}>
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
