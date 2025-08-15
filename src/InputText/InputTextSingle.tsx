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
  hideValue?: boolean // DEPRECATED. Use type="password" instead.
  type?: "text" | "email" | "password"
  autoComplete?: string
  name?: string
}

export const InputTextSingle = forwardRef<HTMLInputElement, InputTextSingleProps>((p, ref) => {
  // Deprecation warning for hideValue
  if (p.hideValue && !p.type && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn("InputTextSingle: 'hideValue' prop is deprecated. Use 'type=\"password\"' instead.")
  }

  return (
    <InputText
      className="<InputTextSingle /> -"
      type={p.type ?? (p.hideValue ? "password" : "text")}
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
