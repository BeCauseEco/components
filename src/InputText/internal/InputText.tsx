import styled from "@emotion/styled"
import { forwardRef, ReactElement, useId, useState } from "react"
import { Color, computeColor } from "@new/Color"
import { StyleFontFamily, StyleBodySmall, Text, StyleBodyMedium } from "@new/Text/Text"
import { Size } from "@new/Size"
import { Playwright } from "@new/Playwright"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Align/Align"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"

const Output = styled.output<Pick<InputTextProps, "color" | "size" | "rows"> & { focus: boolean }>(p => ({
  display: "flex",
  width: p.rows === 1 ? "100%" : "calc(100% - 1px)",
  height: p.rows === 1 ? "calc(var(--BU) * 8)" : `calc(var(--BU) * 8 * ${p.rows - 1} + calc(var(--BU) * 3) - 2px)`,

  ...(p.rows !== 1 && {
    marginTop: "1px",
    marginRight: "1px",
    marginBottom: "1px",
  }),

  padding: p.rows === 1 ? "0 calc(var(--BU) * 2)" : "calc(var(--BU) * 2)",
  resize: "none",
  color: computeColor([p.color, 700]),
  border: "none",
  outline: "none",
  background: "transparent",
  borderRadius: Size.Tiny,

  ...(p.focus && {
    "::-webkit-scrollbar-track": {
      backgroundColor: computeColor([p.color, 50]),
      borderRadius: 0,
      borderTopRightRadius: "2px",
      borderBottomRightRadius: "2px",
    },

    "::-webkit-scrollbar-thumb": {
      backgroundColor: computeColor([p.color, 400]),
      borderColor: computeColor([p.color, 50]),
    },
  }),

  ...StyleFontFamily,
  ...(p.size === "small" ? StyleBodySmall : StyleBodyMedium),

  "&::selection": {
    background: computeColor([p.color, 200]),
  },

  "&::placeholder": {
    color: computeColor([p.color, 300]),
  },
}))

const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
})

export type InputTextProps = Playwright & {
  size: "small" | "large"
  rows: 1 | 2 | 3

  color: Color

  value: string
  onChange: (value: string) => void

  loading?: boolean
  disabled?: boolean

  placeholder?: string
  label?: string
  iconNameLeft?: string
  iconNameRight?: string

  collapse?: boolean
}

export const InputText = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputTextProps>((p, ref) => {
  const key = useId()

  const [focus, setFocus] = useState(false)

  let label: ReactElement = <></>
  let iconStart: ReactElement = <></>
  let iconEnd: ReactElement = <></>

  if (p.label) {
    label = (
      <Align horizontal left hug>
        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

        <Label htmlFor={key}>
          <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[p.color, 700]}>
            {p.label}
          </Text>
        </Label>
      </Align>
    )
  }

  if (p.iconNameLeft && p.rows === 1) {
    iconStart = (
      <Align horizontal center={p.rows === 1} hug="width">
        <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

        <Icon name={p.iconNameLeft} small={p.size === "small"} large={p.size === "large"} fill={[p.color, 700]} />
      </Align>
    )
  }

  if (p.iconNameRight && p.rows === 1) {
    iconEnd = (
      <Align horizontal center hug="width">
        <Icon name={p.iconNameRight} small={p.size === "small"} large={p.size === "large"} fill={[p.color, 700]} />

        <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />
      </Align>
    )
  }

  return (
    <Stack
      horizontal
      colorOutline={[p.color, 700]}
      colorOutlineHover={focus ? [p.color, 700] : [p.color, 900]}
      colorBackground={[focus ? p.color : Color.Transparent, 50]}
      cornerRadius="small"
      hug
    >
      {label}

      {iconStart}

      <Align horizontal left>
        <Output
          as={p.rows === 1 ? "input" : "textarea"}
          // @ts-expect-error TypeScript can't infer the type of the `ref` prop when using as="...".
          ref={ref}
          id={key}
          value={p.value}
          rows={p.rows || 1}
          color={p.color}
          size={p.size}
          focus={focus}
          placeholder={p.placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={event => {
            if (p.onChange) {
              p.onChange(event?.target?.["value"])
            }
          }}
        />
      </Align>

      {iconEnd}
    </Stack>
  )
})
