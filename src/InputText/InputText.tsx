import styled from "@emotion/styled"
import { ChangeEvent, forwardRef, ReactNode, useId } from "react"
import { EColor, computeColor } from "@new/Color"
import { StyleFontFamily, StyleBodyXsmall, TText } from "@new/Text/Text"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { EDirection } from "@new/EDirection"
import { ESize } from "@new/ESize"
import { TPlaywright } from "@new/TPlaywright"

const Output = styled.output<Pick<TInputText, "color" | "width"> & { rows: number }>(p => ({
  display: "flex",
  width: p.width,
  height: p.rows === 1 ? "calc(var(--BU) * 7)" : `calc(var(--BU) * 7 * ${p.rows - 1} + calc(var(--BU) * 3))`,
  padding: p.rows === 1 ? "0 calc(var(--BU) * 2)" : "calc(var(--BU) * 2)",
  resize: "none",
  borderRadius: "var(--BU)",
  color: computeColor([p.color, 700]),
  border: "none",
  outline: "none",
  boxShadow: `inset 0 0 0 1px ${computeColor([p.color, 700])}`,
  ...StyleFontFamily,
  ...StyleBodyXsmall,

  "&:focus": {
    backgroundColor: `${computeColor([p.color, 100])}`,
  },

  "&::selection": {
    background: computeColor([p.color, 200]),
  },

  "&::placeholder": {
    color: computeColor([p.color, 400]),
  },
}))

const Label = styled.label({
  display: "flex",
  width: "100%",
  userSelect: "none",
  cursor: "pointer",
})

export type TInputText = TPlaywright & {
  rows?: 1 | 2 | 3
  color: EColor
  width: ESize.Full | ESize.TwoThirds | ESize.Half | ESize.Quarter
  label?: ReactNode<TText>
  placeholder?: string
  value: string
  id?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export const InputText = forwardRef<HTMLInputElement, TInputText>((props, ref) => {
  const key = useId()

  const { rows = 1, color, width, label, placeholder = "", value = "", id, onChange, playwrightTestId } = props

  const propsOverride = {
    ...props,
    ...{
      onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event?.target?.value)
      },
    },
  }

  return (
    <KeyValuePair direction={EDirection.Vertical} spacing={ESize.Xsmall} playwrightTestId={playwrightTestId}>
      {label && <Label htmlFor={id ?? key}>{label}</Label>}

      <Output
        as={rows !== 1 ? "textarea" : "input"}
        ref={ref}
        id={id ?? key}
        value={value}
        rows={rows}
        color={color}
        width={width}
        placeholder={placeholder}
        {...(propsOverride as any)}
      />
    </KeyValuePair>
  )
})
