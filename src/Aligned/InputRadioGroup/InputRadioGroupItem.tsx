import { EColor } from "@new/Color"
import { Text } from "@new/Aligned/Text/Text"
import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { useId } from "react"
import { TPlaywright } from "@new/TPlaywright"
import { Icon } from "@new/Aligned/Icon/Icon"
import { Stack } from "@new/Aligned/Stack/Stack"
import { Align } from "@new/Aligned/Align/Align"
import { Spacer } from "@new/Aligned/Spacer/Spacer"

const Item = styled(RadixRadioGroup.Item)({
  all: "unset",
  display: "flex",
  position: "relative",
  cursor: "pointer",

  "&:focus": {
    // boxShadow: "0 0 0 2px currentColor",
  },
})

const IndicatorUnchecked = styled.div({
  display: "flex",
})

const IndicatorChecked = styled(RadixRadioGroup.Indicator)({
  display: "flex",
  position: "absolute",
})

const Label = styled.label({
  display: "flex",
  cursor: "pointer",
  userSelect: "none",
})

export type TInputRadioGroupItem = TPlaywright & {
  value: string
  color: EColor
  size: "small" | "large"
  label: string
}

export const InputRadioGroupItem = (p: TInputRadioGroupItem) => {
  const key = useId()

  return (
    <Stack horizontal collapse playwrightTestId={p.playwrightTestId}>
      <Align horizontal left collapse>
        <Item id={key} value={p.value} color={p.color}>
          <IndicatorUnchecked>
            <Icon name="radio_button_unchecked" size="large" fill={[p.color, 700]} />
          </IndicatorUnchecked>

          <IndicatorChecked>
            <Icon name="radio_button_checked" size="large" fill={[p.color, 700]} />
          </IndicatorChecked>
        </Item>

        <Spacer tiny />

        <Label htmlFor={key}>
          <Text size={p.size === "small" ? "small" : "medium"} color={[p.color, 700]}>
            {p.label}
          </Text>
        </Label>
      </Align>
    </Stack>
  )
}
