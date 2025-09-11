import { forwardRef } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color } from "@new/Color"

export type InputTextSingleProps = Pick<
  InputTextProps,
  | "id"
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
> & {
  color: Color
  type?: "text" | "email" | "password" | "number"
  autoComplete?: string
  name?: string
}

export const InputTextSingle = forwardRef<HTMLInputElement, InputTextSingleProps>((p, ref) => {
  return (
    <InputText
      className="<InputTextSingle /> -"
      type={p.type ?? "text"}
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
      rows={1}
      disabled={p.disabled ? true : undefined}
      value={p.value}
      data-playwright-testid={p["data-playwright-testid"]}
      id={p.id}
      autoComplete={p.autoComplete}
      name={p.name}
    />
  )
})
