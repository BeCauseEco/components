import { forwardRef } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color } from "@new/Color"

export type InputTextSingleProps = Pick<
  InputTextProps,
  | "size"
  | "width"
  | "label"
  | "placeholder"
  | "hint"
  | "error"
  | "iconNameLeft"
  | "iconNameRight"
  | "loading"
  | "disabled"
  | "value"
  | "onChange"
> & {
  color: Color
}

export const InputTextSingle = forwardRef<HTMLInputElement, InputTextSingleProps>((p, ref) => {
  return (
    <InputText
      className="<InputTextSingle /> -"
      ref={ref}
      size={p.size}
      width={p.width}
      color={p.color}
      label={p.label}
      loading={p.loading}
      onChange={p.onChange}
      placeholder={p.placeholder}
      hint={p.hint}
      error={p.error}
      iconNameLeft={p.iconNameLeft}
      iconNameRight={p.iconNameRight}
      rows={1}
      disabled={p.disabled}
      value={p.value}
    />
  )
})
