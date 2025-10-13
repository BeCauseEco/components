export const validateAndFormatNumber = (
  newValue: string,
  oldValue: string,
  settings: {
    allowNegative?: boolean
    allowDecimals?: boolean
    allowEmpty?: boolean
  } = { allowNegative: false, allowDecimals: true, allowEmpty: false },
): string => {
  let newValueTrimmed = newValue.trim()
  if (!settings.allowNegative) {
    newValueTrimmed = newValueTrimmed.replace(/-/g, "")
  }

  // Handle empty string
  if (!newValueTrimmed) {
    return settings.allowEmpty ? "" : "0"
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
  if (settings.allowDecimals) {
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
