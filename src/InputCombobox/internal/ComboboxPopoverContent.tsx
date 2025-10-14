import React, { ReactElement } from "react"
import { Command, CommandList } from "cmdk"
import { CommandEmptyStyled } from "./InputCombobox.styles"
import { Align } from "@new/Stack/Align"
import { Spacer } from "@new/Stack/Spacer"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Text } from "@new/Text/Text"
import { OverflowContainer } from "@new/OverflowContainer/OverflowContainer"
import { Color } from "@new/Color"

export interface ComboboxPopoverContentProps {
  filterOptions?: { textFilterNoResults: string; textFilterPlaceholder: string }
  itemsCount: number
  search: string
  onSearchChange: (value: string) => void
  size: "small" | "large"
  color: Color
  enableVirtuoso?: boolean
  commandListItems: ReactElement | null
}

/**
 * Renders the popover content with optional filter input and command list
 */
export const ComboboxPopoverContent: React.FC<ComboboxPopoverContentProps> = ({
  filterOptions,
  itemsCount,
  search,
  onSearchChange,
  size,
  color,
  enableVirtuoso,
  commandListItems,
}) => {
  return (
    <Align vertical topLeft>
      {filterOptions && itemsCount > 9 && (
        <InputTextSingle
          size="small"
          width="auto"
          color={color}
          value={search}
          placeholder={filterOptions.textFilterPlaceholder}
          onChange={onSearchChange}
        />
      )}

      <Spacer tiny={size === "small"} xsmall={size === "large"} />

      {enableVirtuoso ? (
        <Command style={{ width: "100%" }} loop>
          {filterOptions && (
            <CommandEmptyStyled>
              <Text fill={[color, 700]} xsmall={size === "small"} small={size !== "small"} textOverflow>
                {filterOptions.textFilterNoResults}
              </Text>
            </CommandEmptyStyled>
          )}

          <CommandList>{commandListItems}</CommandList>
        </Command>
      ) : (
        <OverflowContainer
          axes="vertical"
          colorBackground={[Color.White]}
          colorForeground={Color.Neutral}
          maxHeight="radix-popover-content-available-height-SAFE-AREA-INPUTTEXT"
          minWidth="radix-popover-trigger-width"
          maxWidth="radix-popover-content-available-width"
          hug
        >
          <Command loop>
            {filterOptions && (
              <CommandEmptyStyled>
                <Text fill={[color, 700]} xsmall={size === "small"} small={size !== "small"} textOverflow>
                  {filterOptions.textFilterNoResults}
                </Text>
              </CommandEmptyStyled>
            )}

            <CommandList>{commandListItems}</CommandList>
          </Command>
        </OverflowContainer>
      )}
    </Align>
  )
}
