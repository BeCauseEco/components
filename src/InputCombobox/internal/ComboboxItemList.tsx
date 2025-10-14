import React, { ReactElement } from "react"
import { Virtuoso } from "react-virtuoso"
import { InputComboboxItemProps } from "../InputComboboxItem"
import { CommandGroupStyled } from "./InputCombobox.styles"
import { Align } from "@new/Stack/Align"
import { Divider } from "@new/Divider/Divider"
import { Spacer } from "@new/Stack/Spacer"
import { Color } from "@new/Color"

export interface GroupedItemsResult {
  groups: { [groupName: string]: InputComboboxItemProps[] }
  dividerItems: InputComboboxItemProps[]
}

export interface ComboboxItemListProps {
  filteredItems: InputComboboxItemProps[]
  groupedItems: GroupedItemsResult | null
  enableVirtuoso?: boolean
  sortAlphabetically?: boolean
  renderItem: (index: number, item: InputComboboxItemProps) => React.ReactNode
}

/**
 * Renders the list of combobox items, handling virtualization, grouping, and flat rendering
 */
export const ComboboxItemList: React.FC<ComboboxItemListProps> = ({
  filteredItems,
  groupedItems,
  enableVirtuoso,
  sortAlphabetically,
  renderItem,
}) => {
  if (enableVirtuoso) {
    // For virtuoso, we need to use flat rendering even with groups
    // TODO: Future enhancement could add virtuoso support for groups
    return (
      <Virtuoso
        style={{
          height: "calc(var(--radix-popover-content-available-height) / 2)",
          minWidth: "100%",
          maxWidth: "calc(var(--radix-popover-content-available-width) - var(--BU) * 4)",

          overflowX: "hidden",
        }}
        increaseViewportBy={100}
        data={filteredItems}
        itemContent={(index, item) => renderItem(index, item)}
      />
    )
  }

  if (groupedItems) {
    // Render grouped items
    const { groups, dividerItems } = groupedItems
    const groupEntries = Object.entries(groups)

    // Sort group names alphabetically if sortAlphabetically is true
    if (sortAlphabetically) {
      groupEntries.sort(([a], [b]) => {
        // Ensure "Other" group always appears last
        if (a === "Other") {
          return 1
        }
        if (b === "Other") {
          return -1
        }
        return a.localeCompare(b)
      })
    }

    return (
      <>
        {groupEntries.map(([groupName, groupItems]) => (
          <CommandGroupStyled key={groupName} heading={groupName}>
            {groupItems.map((item, index) => renderItem(index, item))}
          </CommandGroupStyled>
        ))}
        {dividerItems.length > 0 && (
          <>
            {/* Only show divider if there are other groups */}
            {groupEntries.length > 0 && (
              <Align vertical>
                <Divider fill={[Color.Neutral, 100]} />
                <Spacer small />
              </Align>
            )}
            {/* All dash items rendered without individual dividers */}
            {dividerItems.map((item, index) => (
              <React.Fragment key={`divider-${index}`}>{renderItem(index, item)}</React.Fragment>
            ))}
          </>
        )}
      </>
    )
  }

  // Render flat items
  return <>{filteredItems.map((item, index) => renderItem(index, item))}</>
}
