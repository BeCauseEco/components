import { ReactElement, useId } from "react"
import * as RadixSwitch from "@radix-ui/react-switch"
import styled from "@emotion/styled"
import { computeColor, Color } from "@new/Color"
import { TextProps } from "@new/Text/Text"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { EDirection } from "@new/EDirection"
import { Size } from "@new/Size"
import { PlaywrightProps } from "@new/Playwright"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Stack/Spacer"

const Container = styled.div<{ disabled?: boolean }>(p => ({
  display: "flex",
  opacity: p.disabled ? 0.5 : 1,
  pointerEvents: p.disabled ? "none" : "auto",

  "& > button": {
    all: "unset",
  },
}))

const SwitchRoot = styled(RadixSwitch.Root)<Pick<TSwitch, "colorBackground" | "colorValueTrue">>(p => ({
  display: "flex",
  position: "relative",
  width: "calc(var(--BU) * 8)",
  height: "calc(var(--BU) * 5)",
  border: 0,
  backgroundColor: computeColor([p.colorBackground, 300]),
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
  width: "calc(var(--BU) * 5 - 2px)",
  height: "calc(var(--BU) * 5 - 2px)",
  backgroundColor: computeColor([p.colorForeground, 700]),
  borderRadius: "9999px",
  transition: "transform 100ms",
  transform: "translateX(1px) translateY(1px)",
  willChange: "transform",

  "&[data-state='checked']": {
    transform: "translateX(calc(var(--BU) * 3 + 1px)) translateY(1px)",
  },
}))

const Label = styled.label<{ disabled?: boolean }>(p => ({
  display: "flex",
  userSelect: "none",
  cursor: p.disabled ? "not-allowed" : "pointer",
}))

export type TSwitch = PlaywrightProps & {
  value: boolean
  onChange: (value: boolean) => void
  colorBackground: Color
  colorForeground: Color
  colorValueTrue: Color
  label?: ReactElement<TextProps>
  tooltip?: string
  disabled?: boolean
}

export const Switch = (p: TSwitch) => {
  const key = useId()

  return (
    <Container data-playwright-testid={p["data-playwright-testid"]} disabled={p.disabled}>
      <KeyValuePair direction={EDirection.Horizontal} spacing={Size.Xsmall}>
        <SwitchRoot
          id={key}
          checked={p.value}
          onCheckedChange={value => p.onChange(value)}
          colorBackground={p.colorBackground}
          colorValueTrue={p.colorValueTrue}
          disabled={p.disabled}
        >
          <SwitchThumb colorForeground={p.colorForeground} />
        </SwitchRoot>

        <Label htmlFor={key} disabled={p.disabled}>
          {p.label}

          {p.tooltip && (
            <>
              <Spacer tiny />

              <Icon name="info" small fill={[p.colorBackground, 500]} style="outlined" tooltip={p.tooltip} />
            </>
          )}
        </Label>
      </KeyValuePair>
    </Container>
  )
}
