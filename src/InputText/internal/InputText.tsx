import styled from "@emotion/styled"
import { forwardRef, ReactElement, useId, useState } from "react"
import { Color, computeColor } from "@new/Color"
import { StyleFontFamily, StyleBodySmall, Text, StyleBodyMedium } from "@new/Text/Text"
import { Size } from "@new/Size"
import { PlaywrightProps } from "@new/Playwright"
import { Stack } from "@new/Stack/Stack"
import { Align, AlignProps } from "@new/Align/Align"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"
import { Divider } from "@new/Divider/Divider"
import { InputButton } from "@new/InputButton/internal/InputButton"

const calculateWidth = (rows: InputTextProps["rows"], width: InputTextProps["width"]) => {
  if (rows !== 1) {
    return "calc(100% - 1px)"
  }

  switch (width) {
    case "quarter":
      return "25%"
    case "half":
      return "50%"
    case "full":
      return "calc(100% - 1px)"
  }
}

const Output = styled.output<Pick<InputTextProps, "color" | "size" | "rows" | "width"> & { focus: boolean }>(p => ({
  display: "flex",
  width: calculateWidth(p.rows, p.width),
  minWidth: p.size === "small" ? "calc(var(--BU) * 40)" : "calc(var(--BU) * 48)",
  height:
    p.rows === 1
      ? `calc(var(--BU) * ${p.size === "small" ? 8 : 10})`
      : `calc(var(--BU) * ${p.size === "small" ? 8 : 10}) * ${p.rows - 1} + calc(var(--BU) * 3) - 2px)`,

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

export type InputTextProps = PlaywrightProps & {
  size: "small" | "large"
  width: "quarter" | "half" | "full"

  rows: 1 | 2 | 3

  color: Color

  value: string
  onChange: (value: string) => void

  loading?: boolean
  disabled?: boolean

  placeholder?: string
  label?: [string, "outside" | "inside"]
  hint?: string

  iconNameLeft?: string
  iconNameRight?: string

  hug?: boolean
}

export const InputText = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputTextProps>((p, ref) => {
  const key = useId()

  const [focus, setFocus] = useState(false)

  let labelInside: ReactElement<AlignProps> = <></>
  let labelOutside: ReactElement<AlignProps> = <></>
  let hintInside: ReactElement<AlignProps> = <></>
  let hintOutside: ReactElement<AlignProps> = <></>
  let iconStart: ReactElement<AlignProps> = <></>
  let iconEnd: ReactElement<AlignProps> = <></>

  if (p.label && p.label[1] === "inside") {
    labelInside = (
      <Align horizontal left hug="width">
        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

        <Label htmlFor={key}>
          <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[p.color, 700]}>
            {p.label[0]}
          </Text>
        </Label>
      </Align>
    )

    if (p.hint) {
      hintInside = (
        <Align vertical left hug>
          <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

          <Text tiny={p.size === "small"} xsmall={p.size !== "small"} fill={[p.color, 700]}>
            {p.hint}
          </Text>
        </Align>
      )
    }
  }

  if (p.label && p.label[1] === "outside") {
    labelOutside = (
      <Align vertical left hug="width">
        <Label htmlFor={key}>
          <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[p.color, 700]}>
            {p.label[0]}
          </Text>
        </Label>

        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
      </Align>
    )

    if (p.hint) {
      hintOutside = (
        <Align vertical left hug>
          <Text tiny={p.size === "small"} xsmall={p.size !== "small"} fill={[p.color, 700]}>
            {p.hint}
          </Text>

          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
        </Align>
      )
    }
  }

  if (p.iconNameLeft && p.rows === 1) {
    iconStart = (
      <Align horizontal center hug="width">
        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

        <Icon name={p.iconNameLeft} medium={p.size === "small"} large={p.size === "large"} fill={[p.color, 700]} />
      </Align>
    )
  }

  if (p.iconNameRight && p.rows === 1) {
    iconEnd = (
      <Align horizontal center hug="width">
        <Icon name={p.iconNameRight} medium={p.size === "small"} large={p.size === "large"} fill={[p.color, 700]} />

        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
      </Align>
    )
  }

  return (
    <Stack vertical hug>
      {labelOutside}

      {hintOutside}

      <Align horizontal left>
        <Stack
          horizontal
          colorOutline={[p.color, 700]}
          colorOutlineHover={focus ? [p.color, 700] : [p.color, 900]}
          colorBackground={[focus ? p.color : Color.Transparent, 50]}
          cornerRadius="medium"
          disabled={p.disabled}
          loading={p.loading}
          colorLoading={[p.color, 700]}
          hug
        >
          {labelInside}

          {iconStart}

          <Align horizontal left>
            <Output
              // @ts-expect-error TypeScript can't infer the type of the `ref` prop when using as="...".
              ref={ref}
              as={p.rows === 1 ? "input" : "textarea"}
              id={key}
              value={p.value}
              rows={p.rows || 1}
              color={p.color}
              size={p.size}
              focus={focus}
              placeholder={p.placeholder}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              width={p.width}
              onChange={event => {
                if (p.onChange) {
                  p.onChange(event?.target?.["value"])
                }
              }}
            />
          </Align>

          <Align horizontal center hug="width">
            <InputButton
              variant="blank"
              size={p.size}
              colorForeground={p.value ? [p.color, 700] : [Color.Transparent]}
              iconName="clear"
              iconPlacement="labelNotSpecified"
              onClick={() => {
                if (p.onChange) {
                  p.onChange("")
                }
              }}
            />
          </Align>

          {p.iconNameRight ? (
            <>
              <Align vertical center>
                <Spacer xsmall />

                <Divider vertical fill={p.value ? [p.color, 300] : [Color.Transparent]} />

                <Spacer xsmall />
              </Align>

              <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />
            </>
          ) : (
            <></>
          )}

          {iconEnd}
        </Stack>
      </Align>

      {hintInside}
    </Stack>
  )
})
