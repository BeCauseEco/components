import styled from "@emotion/styled"
import { ChangeEvent, forwardRef, useId } from "react"
import { EColor, computeColor } from "@new/Color"
import { StyleFontFamily, StyleBodyXsmall } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { TPlaywright } from "@new/TPlaywright"
import { Stack } from "@new/Aligned/Stack/Stack"
import { Align } from "../Align/Align"

const Output = styled.output<Pick<TInputText, "color" | "width"> & { rows: number }>(p => ({
  display: "flex",
  width: p.width,
  height: p.rows === 1 ? "calc(var(--BU) * 8)" : `calc(var(--BU) * 8 * ${p.rows - 1} + calc(var(--BU) * 3))`,
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
  size: ESize.Small | ESize.Large
  width: "full" | "two-thirds" | "half" | "quarter"
  rows?: 1 | 2 | 3

  color: EColor

  value: string
  onChange: (value: string) => void

  loading?: boolean
  disabled?: boolean

  placeholder?: string
  label?: string
  iconName?: string
  iconPlacement?: "beforeLabel" | "afterLabel" | "labelNotSpecified"

  collapse?: boolean
}

export const InputText = forwardRef<HTMLInputElement, TInputText>((p, ref) => {
  const key = useId()

  const pOverride = {
    ...p,
    ...{
      onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
        p.onChange(event?.target?.value)
      },
    },
  }

  return (
    <Stack playwrightTestId={p.playwrightTestId}>
      <Align left>
        {label && <Label htmlFor={key}>{label}</Label>}

        <Output
          as={rows !== 1 ? "textarea" : "input"}
          ref={ref}
          id={id ?? key}
          value={value}
          rows={rows}
          color={color}
          width={width}
          placeholder={placeholder}
          {...(pOverride as any)}
        />
      </Align>
    </Stack>
  )
})
