import { forwardRef, useState, useEffect } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color, ColorWithLightness } from "@new/Color"

/**
 * Validates and filters number input with smart minus sign handling
 */
const filterNumberInput = (value: string, currentDisplayValue: string = ""): string => {
  if (value === "" || value === null || value === undefined) {
    return ""
  }

  const trimmed = value.trim()

  // Smart minus sign handling
  if (value === "-" && currentDisplayValue === "") {
    return "-0"
  }

  // Check if user just typed a minus sign (new minus appears in the input)
  const newMinusCount = (trimmed.match(/-/g) || []).length
  const currentMinusCount = (currentDisplayValue.match(/-/g) || []).length

  if (newMinusCount > currentMinusCount && !currentDisplayValue.startsWith("-")) {
    // User added a minus to a positive number → make it negative
    const withoutMinus = currentDisplayValue.replace(/-/g, "")
    if (withoutMinus !== "" && withoutMinus !== "0") {
      return "-" + withoutMinus
    }
  }

  // Only allow digits, minus sign, and single decimal point
  let filtered = trimmed.replace(/[^-\d.]/g, "")

  // Handle multiple minus signs - keep only one at the start
  if (filtered.includes("-")) {
    const minusIndex = filtered.indexOf("-")
    if (minusIndex > 0) {
      // If minus is not at start, move it to start (toggle negative)
      const withoutMinus = filtered.replace(/-/g, "")
      if (withoutMinus !== "") {
        filtered = "-" + withoutMinus
      } else {
        filtered = "-0"
      }
    } else {
      // Ensure only one minus sign at the start
      filtered = "-" + filtered.substring(1).replace(/-/g, "")
    }
  }

  // Ensure only one decimal point
  const decimalIndex = filtered.indexOf(".")
  if (decimalIndex !== -1) {
    const beforeDecimal = filtered.substring(0, decimalIndex + 1)
    const afterDecimal = filtered.substring(decimalIndex + 1).replace(/\./g, "")
    filtered = beforeDecimal + afterDecimal
  }

  return filtered
}

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
> & {
  outlineColor?: ColorWithLightness
  color: Color
  type?: "text" | "email" | "password" | "number"
  autoComplete?: string
  name?: string
}

export const InputTextSingle = forwardRef<HTMLInputElement, InputTextSingleProps>((p, ref) => {
  // For number inputs, manage display state separately to enable smart typing
  const [displayValue, setDisplayValue] = useState(p.value || "")
  const isNumberInput = p.type === "number"

  // Update display value when prop value changes externally
  useEffect(() => {
    if (!isNumberInput) return
    setDisplayValue(p.value || "")
  }, [p.value, isNumberInput])

  // Handle onChange for number inputs with smart filtering
  const handleChange = (value: string) => {
    if (isNumberInput) {
      const filtered = filterNumberInput(value, displayValue)
      setDisplayValue(filtered)
      p.onChange(filtered)
    } else {
      p.onChange(value)
    }
  }

  return (
    <InputText
      outlineColor={p.outlineColor}
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
      value={isNumberInput ? displayValue : p.value}
      data-playwright-testid={p["data-playwright-testid"]}
      id={p.id}
      autoComplete={p.autoComplete}
      name={p.name}
      tooltip={p.tooltip}
    />
  )
})
