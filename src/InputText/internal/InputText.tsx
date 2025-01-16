import styled from "@emotion/styled"
import { forwardRef, ReactElement, useId, useState } from "react"
import { Color, computeColor } from "@new/Color"
import { StyleFontFamily, StyleBodySmall, Text, StyleBodyXsmall } from "@new/Text/Text"
import { Size } from "@new/Size"
import { Stack } from "@new/Stack/Stack"
import { Align, AlignProps } from "@new/Stack/Align"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Stack/Spacer"
import { Divider } from "@new/Divider/Divider"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { ComponentBaseProps } from "@new/ComponentBaseProps"

export type InputTextProps = ComponentBaseProps & {
  type: "text" | "date"

  size: "small" | "large"
  width: "auto" | "fixed"

  rows: 1 | 2 | 3

  color: Color

  value: string
  onChange: (value: string) => void

  loading?: boolean
  disabled?: boolean

  placeholder?: string
  label?: ["outside" | "inside", string]
  hint?: string
  error?: string
  required?: boolean

  iconNameLeft?: string
  iconNameRight?: string

  hug?: boolean

  component?: string

  dateMin?: string
  dateMax?: string
}

const calculateWidth = (rows: InputTextProps["rows"], width: InputTextProps["width"], size: InputTextProps["size"]) => {
  if (rows !== 1) {
    return width === "auto"
      ? "calc(100% - 1px)"
      : size === "small"
        ? "calc(var(--BU) * 70 - 1px)"
        : "calc(var(--BU) * 80 - 1px)"
  }

  return width === "auto" ? "100%" : size === "small" ? "calc(var(--BU) * 70)" : "calc(var(--BU) * 80)"
}

const Output = styled.output<Pick<InputTextProps, "color" | "size" | "rows"> & { focus: boolean }>(p => ({
  display: "flex",
  position: "relative",
  width: "100%",
  height:
    p.rows === 1
      ? `calc(var(--BU) * ${p.size === "small" ? 8 : 10})`
      : `calc(var(--BU) * ${p.size === "small" ? 8 : 10}) * ${p.rows - 1} + calc(var(--BU) * 3) - 2px)`,

  ...(p.rows !== 1 && {
    marginTop: "1px",
    marginRight: "1px",
    marginBottom: "1px",
  }),

  padding:
    p.rows === 1
      ? `0 calc(var(--BU) * ${p.size === "small" ? 2 : 2})`
      : `calc(var(--BU) * ${p.size === "small" ? 2 : 2})`,

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
  ...(p.size === "small" ? StyleBodyXsmall : StyleBodySmall),

  "&::selection": {
    background: computeColor([p.color, 200]),
  },

  "&::placeholder": {
    color: computeColor([p.color, 300]),
  },

  "::-webkit-calendar-picker-indicator": {
    position: "absolute",
    opacity: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    cursor: "pointer",
  },
}))

const StackWidthOverride = styled(Stack)<Pick<InputTextProps, "size" | "rows" | "width">>(p => ({
  width: calculateWidth(p["rows"], p["width"], p["size"]),
  minWidth: calculateWidth(p["rows"], p["width"], p["size"]),
  flexShrink: 0,
}))

const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
  alignItems: "center",
})

export const InputText = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputTextProps>((p, ref) => {
  const key = useId()

  const [focusCapture, setFocusCapture] = useState(false)

  let labelInside: ReactElement<AlignProps> = <></>
  let labelOutside: ReactElement<AlignProps> = <></>
  let hintInside: ReactElement<AlignProps> = <></>
  let hintOutside: ReactElement<AlignProps> = <></>
  let errorEitherSide: ReactElement<AlignProps> = <></>
  let iconStart: ReactElement<AlignProps> = <></>
  let iconEnd: ReactElement<AlignProps> = <></>

  if (p.label && p.label[0] === "inside") {
    labelInside = (
      <Align horizontal left hug="width">
        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

        <Label htmlFor={key}>
          <Text xsmall={p.size === "small"} small={p.size === "large"} fill={[p.color, 500]}>
            {p.label[1]}
          </Text>

          {p.required && (
            <>
              <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

              <Icon name="asterisk" small={p.size === "small"} medium={p.size === "large"} fill={[Color.Error, 700]} />
            </>
          )}
        </Label>
      </Align>
    )

    if (p.hint) {
      hintInside = (
        <Align vertical left hug>
          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

          <Text tiny={p.size === "small"} xsmall={p.size !== "small"} fill={[p.color, 700]}>
            {p.hint}
          </Text>
        </Align>
      )
    }
  }

  if (p.label && p.label[0] === "outside") {
    labelOutside = (
      <Align vertical left hug="width">
        <Label htmlFor={key}>
          <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[p.color, 700]}>
            <b>{p.label[1]}</b>
          </Text>

          {p.required && (
            <>
              <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

              <Icon name="asterisk" small={p.size === "small"} medium={p.size === "large"} fill={[Color.Error, 700]} />
            </>
          )}
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

        <Icon
          name={p.iconNameLeft}
          medium={p.size === "small"}
          large={p.size === "large"}
          fill={[p.error ? Color.Error : p.color, 700]}
        />
      </Align>
    )
  }

  if (p.iconNameRight && p.rows === 1) {
    iconEnd = (
      <Align horizontal center hug="width">
        <Icon
          name={p.iconNameRight}
          medium={p.size === "small"}
          large={p.size === "large"}
          fill={[p.error ? Color.Error : p.color, 700]}
        />

        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
      </Align>
    )
  }

  if (p.error) {
    errorEitherSide = (
      <Align vertical left hug="width">
        <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

        <Text tiny={p.size === "small"} xsmall={p.size !== "small"} fill={[Color.Error, 700]}>
          {p.error}
        </Text>
      </Align>
    )
  }

  return (
    <StackWidthOverride
      className={p.className}
      rows={p.rows}
      width={p.width}
      size={p.size}
      vertical
      hug
      data-playwright-testid={p["data-playwright-testid"]}
    >
      {labelOutside}

      {hintOutside}

      <Align horizontal left>
        <Stack
          horizontal
          stroke={p.disabled ? [p.color, 100] : [p.error ? Color.Error : p.color, 300]}
          strokeHover={
            p.disabled
              ? [p.color, 100]
              : focusCapture
                ? [p.error ? Color.Error : p.color, 700]
                : [p.error ? Color.Error : p.color, 700]
          }
          fill={p.disabled ? [p.color, 50] : [focusCapture ? (p.error ? Color.Error : p.color) : Color.White, 50]}
          cornerRadius="medium"
          disabled={p.disabled ? true : undefined}
          loading={p.loading ? true : undefined}
          fillLoading={[p.color, 700]}
          hug
        >
          {labelInside}

          {iconStart}

          <Align horizontal left>
            <Output
              // @ts-expect-error TypeScript can't infer the type of the `ref` prop when using as="...".
              ref={ref}
              as={p.rows === 1 ? "input" : "textarea"}
              type={p.type}
              id={key}
              value={p.value}
              rows={p.rows || 1}
              color={p.error ? Color.Error : p.color}
              size={p.size}
              focus={focusCapture}
              placeholder={p.placeholder}
              onFocusCapture={() => setFocusCapture(true)}
              onBlur={() => setFocusCapture(false)}
              width={p.width}
              min={p.type === "date" ? p.dateMin : undefined}
              max={p.type === "date" ? p.dateMax : undefined}
              autoComplete="one-time-code"
              onChange={event => {
                if (p.onChange) {
                  p.onChange(event?.target?.["value"])
                }
              }}
            />
          </Align>

          {p.rows === 1 && p.type !== "date" ? (
            <Align horizontal center hug="width">
              <InputButton
                variant="blank"
                width="auto"
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
          ) : (
            <></>
          )}

          {/* {p.rows === 1 && p.type === "date" ? (
            <Align horizontal center hug="width">
              <div style={{ all: "inherit", cursor: "pointer !important" }}>
                <Icon
                  name="calendar_month"
                  medium={p.size === "small"}
                  large={p.size === "large"}
                  fill={[p.error ? Color.Error : p.color, 700]}
                  onClick={event => {
                    event?.target?.parentElement?.parentElement?.parentElement
                      ?.querySelectorAll("input")?.[0]
                      ?.showPicker()
                  }}
                />
              </div>
            </Align>
          ) : (
            <></>
          )} */}

          {p.iconNameRight ? (
            <>
              <Align vertical center hug="width">
                <Divider vertical fill={p.value ? [p.color, 300] : [Color.Transparent]} overrideHeight="50%" />
              </Align>

              <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
            </>
          ) : (
            <></>
          )}

          {iconEnd}
        </Stack>
      </Align>

      {errorEitherSide}

      {hintInside}
    </StackWidthOverride>
  )
})
