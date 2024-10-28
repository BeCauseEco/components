import styled from "@emotion/styled"
import { ESize } from "@new/ESize"
import { EColor } from "@new/Color"
import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { Icon } from "@new/Aligned/Icon/Icon"
import { Text } from "@new/Text/Text"
import { useId } from "react"
import { TPlaywright } from "@new/TPlaywright"
import { Stack } from "@new/Aligned/Stack/Stack"
import { Spacer } from "@new/Aligned/Spacer/Spacer"
import { Align } from "@new/Aligned/Align/Align"

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

export type TInputCheckBox = TPlaywright & {
  size: ESize.Small | ESize.Large
  color: EColor
  value: boolean | "indeterminate"
  onChange: (value: boolean) => void
  label?: string
}

export const InputCheckbox = (p: TInputCheckBox) => {
  const key = useId()

  return (
    <Container>
      <Stack horizontal collapse>
        <Align horizontal left collapse>
          <Root id={key} checked={p.value} onCheckedChange={checked => p.onChange(checked === true)}>
            {p.value === "indeterminate" && (
              <Icon name="indeterminate_check_box" size="large" color={[p.color, 700]} fill />
            )}

            {p.value === true && <Icon name="check_box" size="large" color={[p.color, 700]} fill />}

            {p.value === false && <Icon name="check_box_outline_blank" size="large" color={[p.color, 700]} />}
          </Root>

          {p.label && (
            <>
              <Spacer tiny />

              <Label htmlFor={key}>
                <Text size={p.size === ESize.Small ? ESize.Small : ESize.Medium} color={[p.color, 700]}>
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
