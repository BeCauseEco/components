import { EColor, computeColor } from "@new/Color"
import { ESize } from "@new/ESize"
import { TText } from "@new/Text/Text"
import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { PropsWithChildren, ReactElement, useId } from "react"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { EDirection } from "@new/EDirection"

const Container = styled.div({
  display: "flex",
  alignItems: "center",
  width: "fit-content",

  "&:not(:last-child)": {
    marginBottom: "var(--BU)",
  },
})

const Item = styled(RadixRadioGroup.Item)<Pick<TInputRadioGroupItem, "colorForeground" | "colorBackground">>(p => ({
  all: "unset",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "calc(var(--BU) * 4)",
  height: "calc(var(--BU) * 4)",
  backgroundColor: computeColor([p.colorBackground, 700]),
  borderRadius: "50%",
  cursor: "pointer",

  "&:focus": {
    // boxShadow: "0 0 0 2px currentColor",
  },
}))

const Indicator = styled(RadixRadioGroup.Indicator)<Pick<TInputRadioGroupItem, "colorForeground" | "colorBackground">>(
  p => ({
    display: "flex",
    position: "relative",

    "&::after": {
      content: "' '",
      display: "block",
      width: "calc(var(--BU) * 1.75)",
      height: "calc(var(--BU) * 1.75)",
      borderRadius: "50%",
      backgroundColor: computeColor([p.colorForeground, 700]),
    },
  }),
)

const Label = styled.label({
  display: "flex",
  cursor: "pointer",
  userSelect: "none",
})

export type TInputRadioGroupItem = {
  value: string
  colorForeground: EColor
  colorBackground: EColor
  children: ReactElement<TText>
}

export const InputRadioGroupItem = ({
  value,
  colorForeground,
  colorBackground,
  children,
}: PropsWithChildren<TInputRadioGroupItem>) => {
  const key = useId()

  return (
    <Container>
      <KeyValuePair direction={EDirection.Horizontal} spacing={ESize.Xsmall}>
        <Item id={key} value={value} colorForeground={colorForeground} colorBackground={colorBackground}>
          <Indicator colorForeground={colorForeground} colorBackground={colorBackground} />
        </Item>

        <Label htmlFor={key}>{children}</Label>
      </KeyValuePair>
    </Container>
  )
}
