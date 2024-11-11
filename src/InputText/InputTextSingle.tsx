import { forwardRef } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color } from "@new/Color"

export type InputTextSingleProps = Pick<
  InputTextProps,
  "size" | "label" | "placeholder" | "iconNameLeft" | "iconNameRight" | "loading" | "disabled" | "value" | "onChange"
> & {
  color: Color
}

export const InputTextSingle = forwardRef<HTMLInputElement, InputTextSingleProps>((p, ref) => {
  return (
    <InputText
      ref={ref}
      size={p.size}
      color={Color.Primary}
      label={p.label}
      loading={p.loading}
      onChange={p.onChange}
      iconNameLeft={p.iconNameLeft}
      iconNameRight={p.iconNameRight}
      rows={1}
      disabled={p.disabled}
      value={p.value}
    />
  )
})
