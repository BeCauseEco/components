import React from "react"
import { Label } from "./InputCombobox.styles"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Text } from "@new/Text/Text"
import { Spacer } from "@new/Stack/Spacer"
import { Icon } from "@new/Icon/Icon"
import { Color } from "@new/Color"

export interface ComboboxLabelProps {
  label?: ["outside" | "outside-small" | "inside", string]
  hint?: string
  required?: boolean
  tooltip?: string
  size: "small" | "large"
  color: Color
  /** When true, allows the label text to wrap to multiple lines instead of staying on a single line */
  wrap?: boolean
}

/**
 * Renders the label for the combobox (outside or outside-small variants)
 */
export const ComboboxLabel: React.FC<ComboboxLabelProps> = ({ label, hint, required, tooltip, size, color, wrap }) => {
  if (!label || label[0] === "inside") {
    return null
  }

  const isOutsideSmall = label[0] === "outside-small"
  const labelColor = isOutsideSmall ? Color.Neutral : color

  return (
    <Stack vertical hug>
      <>
        <Align vertical left hug={wrap ? undefined : "width"}>
          <Label>
            <Text
              xsmall={isOutsideSmall || size === "small"}
              small={!isOutsideSmall && size !== "small"}
              fill={[labelColor, 700]}
              wrap={wrap}
            >
              <b>{label[1]}</b>
            </Text>

            {required && (
              <>
                <Spacer tiny={size === "small"} xsmall={size === "large"} />

                <Icon name="asterisk" small={size === "small"} medium={size === "large"} fill={[Color.Error, 700]} />
              </>
            )}

            {tooltip && (
              <>
                <Spacer tiny />

                <Icon
                  name="info"
                  small={size === "small"}
                  medium={size === "large"}
                  fill={[labelColor, 500]}
                  style="outlined"
                  tooltip={tooltip}
                />
              </>
            )}
          </Label>

          <Spacer xsmall={isOutsideSmall || size === "small"} small={!isOutsideSmall && size === "large"} />
        </Align>

        {hint ? (
          <Align vertical left hug>
            <Text tiny={size === "small"} xsmall={size !== "small"} fill={[color, 700]}>
              {hint}
            </Text>

            <Spacer xsmall={size === "small"} small={size === "large"} />
          </Align>
        ) : (
          <></>
        )}
      </>
    </Stack>
  )
}
