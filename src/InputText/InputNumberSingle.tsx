import { forwardRef, ReactNode } from "react"
import { InputTextProps, InputText, NumberInputSettings } from "@new/InputText/internal/InputText"
import { Color, ColorWithLightness } from "@new/Color"

export type InputNumberSingleProps = Pick<
  InputTextProps,
  | "id"
  | "className"
  | "size"
  | "width"
  | "label"
  | "placeholder"
  | "hint"
  | "error"
  | "required"
  | "iconNameLeft"
  | "iconNameRight"
  | "onLeftIconClick"
  | "onRightIconClick"
  | "loading"
  | "disabled"
  | "value"
  | "onChange"
  | "data-playwright-testid"
  | "tooltip"
> & {
  borderColor?: ColorWithLightness
  color: Color
  autoComplete?: string
  name?: string
  allowNegative?: boolean
  allowDecimals?: boolean
  allowEmpty?: boolean
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  debounceChanges?: boolean
}

export const InputNumberSingle = forwardRef<HTMLInputElement, InputNumberSingleProps>((p, ref) => {
  const numberSettings: NumberInputSettings = {
    allowNegativeNumbers: p.allowNegative || false,
    allowDecimals: p.allowDecimals || false,
    allowEmpty: p.allowEmpty || false,
  }
  return (
    <InputText
      numberSettings={numberSettings}
      debounceChanges={p.debounceChanges}
      borderColor={p.borderColor}
      className={p.className || `<InputNumberSingle />`}
      type="text"
      ref={ref}
      size={p.size}
      width={p.width}
      color={p.color}
      label={p.label}
      loading={p.loading ? true : undefined}
      onChange={p.onChange}
      placeholder={p.placeholder}
      hint={p.hint}
      error={p.error}
      required={p.required}
      iconNameLeft={p.iconNameLeft}
      iconNameRight={p.iconNameRight}
      onLeftIconClick={p.onLeftIconClick}
      onRightIconClick={p.onRightIconClick}
      startAdornment={p.startAdornment}
      endAdornment={p.endAdornment}
      rows={1}
      disabled={p.disabled ? true : undefined}
      value={p.value}
      data-playwright-testid={p["data-playwright-testid"]}
      id={p.id}
      autoComplete={p.autoComplete}
      name={p.name}
      tooltip={p.tooltip}
    />
  )
})
