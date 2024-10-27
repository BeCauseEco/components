import styled from "@emotion/styled"
import { forwardRef, ReactElement, useId, useState } from "react"
import { EColor, computeColor } from "@new/Color"
import { StyleFontFamily, StyleBodySmall, Text, StyleBodyMedium } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { TPlaywright } from "@new/TPlaywright"
import { Stack } from "@new/Aligned/Stack/Stack"
import { Align } from "@new/Aligned/Align/Align"
import { Icon } from "@new/Aligned/Icon/Icon"
import { Spacer } from "@new/Aligned/Spacer/Spacer"

const Output = styled.textarea<Pick<TInputText, "color" | "size" | "rows"> & { focus: boolean }>(p => ({
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
  borderRadius: ESize.Tiny,
  // boxShadow: `inset 0 0 0 1px ${computeColor([p.color, 700])}`,

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
  ...(p.size === ESize.Small ? StyleBodySmall : StyleBodyMedium),

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

export type TInputText = TPlaywright & {
  size: ESize.Small | ESize.Large
  // width: "25%" | "33%" | "50%" | "100%"
  rows: 1 | 2 | 3

  color: EColor

  value: string
  onChange: (value: string) => void

  loading?: boolean
  disabled?: boolean

  placeholder?: string
  label?: string
  iconStartName?: string
  iconEndName?: string

  collapse?: boolean
}

export const InputText = forwardRef<HTMLTextAreaElement, TInputText>((p, ref) => {
  const key = useId()

  const [focus, setFocus] = useState(false)

  let label: ReactElement = <></>
  let iconStart: ReactElement = <></>
  let iconEnd: ReactElement = <></>

  if (p.label) {
    label = (
      <Align horizontal left collapse>
        <Spacer xsmall={p.size === ESize.Small} small={p.size === ESize.Large} />

        <Label htmlFor={key}>
          <Text size={p.size === ESize.Small ? ESize.Xsmall : ESize.Small} color={[p.color, 700]}>
            {p.label}
          </Text>
        </Label>
      </Align>
    )
  }

  if (p.iconStartName && p.rows === 1) {
    iconStart = (
      <Align horizontal center={p.rows === 1} collapse="width">
        <Spacer tiny={p.size === ESize.Small} xsmall={p.size === ESize.Large} />

        <Icon
          name={p.iconStartName}
          size={p.size === ESize.Small ? ESize.Medium : ESize.Large}
          color={[p.color, 700]}
        />
      </Align>
    )
  }

  if (p.iconEndName && p.rows === 1) {
    iconEnd = (
      <Align horizontal center collapse="width">
        <Icon name={p.iconEndName} size={p.size === ESize.Small ? ESize.Medium : ESize.Large} color={[p.color, 700]} />

        <Spacer tiny={p.size === ESize.Small} xsmall={p.size === ESize.Large} />
      </Align>
    )
  }

  return (
    <Stack
      horizontal
      collapse
      colorOutline={[p.color, 700]}
      colorOutlineHover={focus ? [p.color, 700] : [p.color, 900]}
      colorBackground={[focus ? p.color : EColor.Transparent, 50]}
      borderRadius={ESize.Small}
    >
      {label}

      {iconStart}

      <Align horizontal left>
        <Output
          as={p.rows === 1 ? "input" : "textarea"}
          ref={ref}
          id={key}
          value={p.value}
          rows={p.rows || 1}
          color={p.color}
          // width={p.width}
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
