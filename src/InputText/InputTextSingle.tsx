import { forwardRef, ReactNode } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color, ColorWithLightness } from "@new/Color"

export type InputTextSingleProps = Pick<
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
  | "debounceChanges"
> & {
  borderColor?: ColorWithLightness
  color: Color
  type?: "text" | "email" | "password"
  autoComplete?: string
  name?: string
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

export const InputTextSingle = forwardRef<HTMLInputElement, InputTextSingleProps>((p, ref) => {
  const handleChange = (value: string) => {
    p.onChange(value)
  }

  return (
    <InputText
      debounceChanges={p.debounceChanges}
      borderColor={p.borderColor}
      className={p.className || `<InputTextSingle />`}
      type={p.type ?? "text"}
      ref={ref}
      size={p.size}
      width={p.width}
      color={p.color}
      label={p.label}
      loading={p.loading ? true : undefined}
      onChange={handleChange}
      placeholder={p.placeholder}
      hint={p.hint}
      error={p.error}
      required={p.required}
      iconNameLeft={p.iconNameLeft}
      iconNameRight={p.iconNameRight}
      onLeftIconClick={p.onLeftIconClick}
      onRightIconClick={p.onRightIconClick}
      rows={1}
      disabled={p.disabled ? true : undefined}
      value={p.value}
      data-playwright-testid={p["data-playwright-testid"]}
      id={p.id}
      autoComplete={p.autoComplete}
      name={p.name}
      tooltip={p.tooltip}
      startAdornment={p.startAdornment}
      endAdornment={p.endAdornment}
    />
  )
})
