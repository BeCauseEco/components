import { ReactElement, useId } from "react"
import * as RadixSwitch from "@radix-ui/react-switch"
import styled from "@emotion/styled"
import { computeColor, EColor } from "@new/Color"
import { TText } from "@new/Text/Text"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { EDirection } from "@new/EDirection"
import { ESize } from "@new/ESize"

const Container = styled.div({
  display: "flex",

  "& > button": {
    all: "unset",
  },
})

const SwitchRoot = styled(RadixSwitch.Root)<Pick<TSwitch, "colorBackground" | "colorValueTrue">>(p => ({
  display: "flex",
  position: "relative",
  width: "calc(var(--BU) * 10)",
  height: "calc(var(--BU) * 6)",
  outline: `solid 2px ${computeColor([p.colorBackground, 700])}`,
  outlineOffset: "-2px",
  backgroundColor: computeColor([p.colorBackground, 700]),
  borderRadius: "9999px",
  cursor: "pointer",

  "&:focus": {
    // boxShadow: "0 0 0 2px currentColor",
  },

  "&[data-state='checked']": {
    backgroundColor: computeColor([p.colorValueTrue, 700]),
  },
}))

const SwitchThumb = styled(RadixSwitch.Thumb)<Pick<TSwitch, "colorForeground">>(p => ({
  display: "flex",
  width: "calc(var(--BU) * 6 - 4px)",
  height: "calc(var(--BU) * 6 - 4px)",
  backgroundColor: computeColor([p.colorForeground, 700]),
  borderRadius: "9999px",
  transition: "transform 100ms",
  transform: "translateX(0)",
  willChange: "transform",

  "&[data-state='checked']": {
    transform: "translateX(calc(var(--BU) * 4))",
  },
}))

const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
})

export type TSwitch = {
  value: boolean
  onChange: (value: boolean) => void
  colorBackground: EColor
  colorForeground: EColor
  colorValueTrue: EColor
  label?: ReactElement<TText>
}

export const Switch = ({ value, onChange, colorBackground, colorForeground, colorValueTrue, label }: TSwitch) => {
  const key = useId()

  return (
    <Container>
      <KeyValuePair direction={EDirection.Horizontal} spacing={ESize.Xsmall}>
        <SwitchRoot
          id={key}
          checked={value}
          onCheckedChange={value => onChange(value)}
          colorBackground={colorBackground}
          colorValueTrue={colorValueTrue}
        >
          <SwitchThumb colorForeground={colorForeground} />
        </SwitchRoot>

        <Label htmlFor={key}>{label}</Label>
      </KeyValuePair>
    </Container>
  )
}