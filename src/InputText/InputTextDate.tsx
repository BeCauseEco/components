import { forwardRef } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color } from "@new/Color"

export type InputTextDateProps = Pick<
  InputTextProps,
  | "size"
  | "width"
  | "label"
  | "placeholder"
  | "hint"
  | "error"
  | "required"
  | "loading"
  | "disabled"
  | "value"
  | "onChange"
  | "playwrightTestId"
> & {
  color: Color
  min?: string
  max?: string
}

export const InputTextDate = forwardRef<HTMLInputElement, InputTextDateProps>((p, ref) => {
  return (
    <InputText
      className="<InputTextSingle /> -"
      type="date"
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
      rows={1}
      disabled={p.disabled ? true : undefined}
      value={p.value}
      dateMin={p.min}
      dateMax={p.max}
      playwrightTestId={p.playwrightTestId}
    />
  )
})
