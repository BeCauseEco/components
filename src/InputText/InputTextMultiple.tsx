import { forwardRef } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color } from "@new/Color"

export type InputTextMultipleProps = Pick<
  InputTextProps,
  "size" | "label" | "placeholder" | "iconLeftName" | "iconRightName" | "loading" | "disabled" | "value" | "onChange"
>

export const InputTextMultiple = forwardRef<HTMLTextAreaElement, InputTextMultipleProps>((p, ref) => {
  return (
    <InputText
      ref={ref}
      size={p.size}
      color={Color.Primary}
      label={p.label}
      loading={p.loading}
      onChange={p.onChange}
      rows={3}
      disabled={p.disabled}
      value={p.value}
    />
  )
})
