import { forwardRef, ReactNode } from "react"
import { InputTextProps, InputText } from "@new/InputText/internal/InputText"
import { Color, ColorWithLightness } from "@new/Color"

export type InputNumberSingleProps = Pick<
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
  autoComplete?: string
  name?: string
  allowNegative?: boolean
  allowDecimals?: boolean
  allowEmpty?: boolean
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  debounceChanges?: boolean
}

export const InputNumberSingle = forwardRef<HTMLInputElement, InputNumberSingleProps>((p, ref) => {
  const validateAndFormatNumber = (newValue: string, oldValue: string): string => {
    let newValueTrimmed = newValue.trim()
    if (!p.allowNegative) {
      newValueTrimmed = newValueTrimmed.replace(/-/g, "")
    }

    // Handle empty string
    if (!newValueTrimmed) {
      return p.allowEmpty ? "" : "0"
    }

    // Handle just a minus sign
    if (newValueTrimmed === "-") {
      //The user might either have just typed the minus sign or deleted everything else
      return oldValue === "" ? "-0" : "0"
    }

    // Filter out all non-numeric characters except minus and decimal
    let filtered = newValueTrimmed.replace(/[^-\d.]/g, "")

    // Handle multiple minus signs - keep only the first one and move it to the beginning
    const minusPositions: number[] = []
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === "-") {
        minusPositions.push(i)
      }
    }

    if (minusPositions.length > 1) {
      // Remove all minus signs and add one at the beginning
      filtered = "-" + filtered.replace(/-/g, "")
    } else if (minusPositions.length === 1 && minusPositions[0] !== 0) {
      // Move the minus to the beginning
      filtered = "-" + filtered.replace(/-/g, "")
    }

    // Handle decimal points if allowed
    if (p.allowDecimals) {
      const decimalPositions: number[] = []
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === ".") {
          decimalPositions.push(i)
        }
      }

      if (decimalPositions.length > 1) {
        // Keep only the first decimal point
        const parts = filtered.split(".")
        filtered = parts[0] + "." + parts.slice(1).join("")
      }
    } else {
      // Remove all decimal points
      filtered = filtered.replace(/\./g, "")
    }

    // Remove leading zeroes, but preserve "0", "0.", "-0", and "-0."
    const isNegative = filtered.startsWith("-")
    const numberPart = isNegative ? filtered.slice(1) : filtered

    if (numberPart.length > 1 && numberPart[0] === "0" && numberPart[1] !== ".") {
      const withoutLeadingZeroes = numberPart.replace(/^0+/, "")
      filtered = (isNegative ? "-" : "") + (withoutLeadingZeroes || "0")
    }

    return filtered
  }

  const handleChange = (value: string) => {
    const oldValue = p.value
    const formatted = validateAndFormatNumber(value, oldValue)

    p.onChange(formatted)
  }

  return (
    <InputText
      debounceChanges={p.debounceChanges}
      outlineColor={p.outlineColor}
      className={p.className || `<InputNumberSingle />`}
      type="text"
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
      startAdornment={p.startAdornment}
      endAdornment={p.endAdornment}
      rows={1}
      disabled={p.disabled ? true : undefined}
      value={p.value}
      data-playwright-testid={p["data-playwright-testid"]}
      id={p.id}
      autoComplete={p.autoComplete}
      name={p.name}
      tooltip={p.tooltip}
    />
  )
})
