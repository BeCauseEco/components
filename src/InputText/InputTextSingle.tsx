import { forwardRef } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color } from "@new/Color"

export type InputTextSingleProps = Pick<
  InputTextProps,
  "size" | "label" | "placeholder" | "iconLeftName" | "iconRightName" | "loading" | "disabled" | "value" | "onChange"
>

export const InputTextSingle = forwardRef<HTMLInputElement, InputTextSingleProps>((p, ref) => {
  return (
    <InputText
      ref={ref}
      size={p.size}
      color={Color.Primary}
      label={p.label}
      loading={p.loading}
      onChange={p.onChange}
      rows={1}
      disabled={p.disabled}
      value={p.value}
    />
  )
})
