import React from "react"
import { LabelContainer } from "./InputCombobox.styles"
import { InputComboboxItemProps } from "../InputComboboxItem"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Text } from "@new/Text/Text"
import { Spacer } from "@new/Stack/Spacer"
import { Icon } from "@new/Icon/Icon"
import { Badge } from "@new/Badge/Badge"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { Divider } from "@new/Divider/Divider"
import { Color } from "@new/Color"

export interface ComboboxTriggerContentProps {
  button?: {
    label: string
    icon?: string
  }
  label?: ["outside" | "outside-small" | "inside", string]
  multiple?: boolean
  value: string | string[]
  items: { [key: string]: InputComboboxItemProps }
  size: "small" | "large"
  color: Color
  disabled?: boolean
  clearable?: boolean
  resettable?: boolean
  required?: boolean
  tooltip?: string
  textNoSelection: string
  onChange: (value: string | string[]) => void
  onRemoveItem: (label: string) => void
}

/**
 * Renders the content for the combobox trigger button
 */
export const ComboboxTriggerContent: React.FC<ComboboxTriggerContentProps> = ({
  button,
  label,
  multiple,
  value,
  items,
  size,
  color,
  disabled,
  clearable,
  resettable,
  required,
  tooltip,
  textNoSelection,
  onChange,
  onRemoveItem,
}) => {
  const generateCurrentValueLabel = (multiple?: boolean) => {
    if (!multiple) {
      const selectedItem = Object.values(items).findLast(item => value === item.value)

      if (clearable && selectedItem) {
        return (
          <Badge
            size={size}
            variant={disabled ? "opaque" : "solid"}
            label={selectedItem.shortLabel || selectedItem.label}
            title={selectedItem.label}
            color={disabled ? color : Color.Primary}
            onClear={() => {
              onChange("")
            }}
            textOverflow
          />
        )
      }

      return (
        <Stack horizontal hug overflowHidden>
          <Align horizontal left hug>
            {selectedItem?.icon ? (
              <>
                {selectedItem.icon}

                <Spacer xsmall />
              </>
            ) : null}

            <Text fill={[color, 700]} xsmall={size === "small"} small={size === "large"} textOverflow>
              {selectedItem?.shortLabel || selectedItem?.label || textNoSelection}{" "}
            </Text>
          </Align>
        </Stack>
      )
    }

    const selectedValuesSet = new Set(value)

    const selectedItems = Object.entries(items)
      .filter(([, item]) => selectedValuesSet.has(item.value))
      .flatMap(([, item]) => item.label)

    if (selectedItems.length === 0) {
      return (
        <Text xsmall={size === "small"} small={size === "large"} fill={[Color.Neutral, 700]} wrap>
          {textNoSelection}
        </Text>
      )
    }

    const visibleItems = selectedItems.slice(0, 2)
    const remainingCount = selectedItems.length - 2

    return (
      <>
        {visibleItems?.map((item, index) => (
          <>
            <Badge
              key={index}
              label={item}
              title={item}
              size={size}
              variant={disabled ? "opaque" : "solid"}
              color={disabled ? color : Color.Primary}
              onClear={
                clearable
                  ? () => {
                      onRemoveItem(item)
                    }
                  : undefined
              }
              textOverflow
            />

            <Spacer tiny={size === "small"} xsmall={size === "large"} />
          </>
        ))}

        {remainingCount > 0 && (
          <Badge
            key={remainingCount}
            label={`+${remainingCount}`}
            size={size}
            variant={disabled ? "opaque" : "solid"}
            color={disabled ? color : Color.Primary}
          />
        )}
      </>
    )
  }

  if (button) {
    return (
      <Stack horizontal hug>
        <Align horizontal left>
          {button.icon && (
            <>
              <Icon name={button.icon} small={size === "small"} medium={size === "large"} fill={[color, 700]} />
              <Spacer xsmall />
            </>
          )}
          <Text xsmall={size === "small"} small={size === "large"} fill={[color, 700]}>
            {button.label}
          </Text>
        </Align>
      </Stack>
    )
  }

  return (
    <Stack horizontal hug>
      <Align horizontal left>
        {label && label[0] === "inside" ? (
          <>
            <Text xsmall={size === "small"} small={size === "large"} fill={[color, 500]}>
              {label[1]}
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
                  fill={[color, 500]}
                  style="outlined"
                  tooltip={tooltip}
                />
              </>
            )}

            <Spacer xsmall={size === "small"} small={size === "large"} />
          </>
        ) : (
          <></>
        )}

        <LabelContainer>{generateCurrentValueLabel(multiple)}</LabelContainer>
      </Align>

      {resettable && ((!multiple && !clearable) || (multiple && value.length > 1)) ? (
        <Align horizontal right hug="width">
          <Spacer xsmall={size === "small"} small={size === "large"} />

          <InputButton
            variant="blank"
            width="auto"
            size={size}
            colorForeground={value ? [color, 700] : [Color.Transparent]}
            iconName="clear"
            iconPlacement="labelNotSpecified"
            tabIndex={-1}
            onClick={() => {
              if (onChange) {
                onChange(multiple ? [] : "")
              }
            }}
          />

          <Divider vertical fill={value ? [color, 300] : [Color.Transparent]} overrideHeight="50%" />
        </Align>
      ) : (
        <></>
      )}
    </Stack>
  )
}
