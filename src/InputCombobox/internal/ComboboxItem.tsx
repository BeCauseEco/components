import React from "react"
import { InputComboboxItemProps } from "../InputComboboxItem"
import { CommandItemStyled } from "./InputCombobox.styles"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Spacer } from "@new/Stack/Spacer"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { Text } from "@new/Text/Text"
import { Color, ColorWithLightness } from "@new/Color"

export interface ComboboxItemProps {
  item: InputComboboxItemProps
  index: number
  multiple?: boolean
  value: string | string[]
  size: "small" | "large"
  color: Color
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
  colorForeground: ColorWithLightness
  onSelectSingle: (label: string) => void
  onSelectMultiple: (itemValue: string, checked: boolean) => void
}

/**
 * Renders a single combobox item (either with checkbox for multiple mode or text for single mode)
 */
export const ComboboxItem: React.FC<ComboboxItemProps> = ({
  item,
  index,
  multiple,
  value,
  size,
  color,
  colorSelected,
  colorBackgroundHover,
  colorForeground,
  onSelectSingle,
  onSelectMultiple,
}) => {
  const isSelected = multiple ? (value as string[]).includes(item.value) : value === item.value

  return (
    <CommandItemStyled
      key={index}
      multiple={multiple}
      value={item.label}
      onSelect={labelValue => (multiple ? () => {} : onSelectSingle(labelValue))}
      selected={isSelected}
      colorSelected={colorSelected}
      colorBackgroundHover={colorBackgroundHover}
      colorForeground={colorForeground}
      data-playwright-testid={item["data-playwright-testid"]}
    >
      {multiple ? (
        <Stack horizontal hug overflowHidden>
          <Align horizontal left hug>
            {item.icon ? (
              <>
                {item.icon}

                <Spacer xsmall />
              </>
            ) : null}

            <InputCheckbox
              size={size}
              value={isSelected}
              onChange={checked => onSelectMultiple(item.value, checked)}
              color={Color.Primary}
              label={item.label}
            />
          </Align>
        </Stack>
      ) : (
        <Stack horizontal hug overflowHidden>
          <Align horizontal left hug>
            {item.icon ? (
              <>
                {item.icon}

                <Spacer xsmall />
              </>
            ) : null}

            <Text
              xsmall={size === "small"}
              small={size === "large"}
              fill={[color, 700]}
              textOverflow
              title={item.label}
            >
              {item.label}
            </Text>
          </Align>
        </Stack>
      )}
    </CommandItemStyled>
  )
}
