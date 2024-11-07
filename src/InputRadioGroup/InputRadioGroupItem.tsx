import { EColor } from "@new/Color"
import { Text } from "@new/Text/Text"
import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { useId } from "react"
import { TPlaywright } from "@new/TPlaywright"
import { Icon } from "@new/Icon/Icon"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Align/Align"
import { Spacer } from "@new/Spacer/Spacer"

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
  label: string
}

export const InputRadioGroupItem = (p: TInputRadioGroupItem) => {
  const key = useId()

  return (
    <Stack horizontal hug playwrightTestId={p.playwrightTestId}>
      <Align horizontal left hug>
        <Item id={key} value={p.value}>
          <IndicatorUnchecked>
            <Icon name="radio_button_unchecked" large fill={[EColor.Transparent]} />
          </IndicatorUnchecked>

          <IndicatorChecked>
            <Icon name="radio_button_checked" large fill={[EColor.Transparent]} />
          </IndicatorChecked>
        </Item>

        <Spacer tiny />

        <Label htmlFor={key}>
          <Text huge fill={[EColor.Transparent]}>
            {p.label}
          </Text>
        </Label>
      </Align>
    </Stack>
  )
}
