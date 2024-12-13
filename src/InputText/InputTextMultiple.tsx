import { forwardRef } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color } from "@new/Color"

export type InputTextMultipleProps = Pick<
  InputTextProps,
  "size" | "width" | "label" | "placeholder" | "hint" | "error" | "loading" | "disabled" | "value" | "onChange"
> & {
  color: Color
}

export const InputTextMultiple = forwardRef<HTMLTextAreaElement, InputTextMultipleProps>((p, ref) => {
  return (
    <InputText
      className="<InputTextMultiple /> -"
      ref={ref}
      size={p.size}
      width={p.width}
      color={p.color}
      label={p.label}
      placeholder={p.placeholder}
      hint={p.hint}
      error={p.error}
      loading={p.loading}
      onChange={p.onChange}
      rows={3}
      disabled={p.disabled}
      value={p.value}
    />
  )
})
