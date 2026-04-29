import styled from "@emotion/styled"
import { useState, useMemo } from "react"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Spacer } from "@new/Stack/Spacer"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { OverflowContainerProps } from "@new/OverflowContainer/OverflowContainer"
import { List } from "react-window"
import { FilteredVirtualListItem, FilteredVirtualListItemProps } from "@new/FilteredList/FilteredVirtualListItem"
import { PlaywrightProps } from "@new/Playwright"

export type ListItemProps = PlaywrightProps & {
  value: string
  label: string
  labelFilter?: string
  avatarSrc?: string
  subtitle?: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
  isChecked?: boolean
  /** When provided, a checkbox is rendered and row clicks toggle this item instead of firing the list's single-select onChange. */
  onToggleChecked?: () => void
}

export type FilteredListProps = ComponentBaseProps & {
  color: Color
  maxHeight: OverflowContainerProps["maxHeight"] | number
  /** Selected item value for single-select mode. Omit when using per-item `onToggleChecked` (multi-select). */
  value?: string
  disabled?: boolean
  loading?: boolean
  itemHeight?: number | ((index: number) => number)
  items: ListItemProps[]
  hideSearch?: boolean
  /** When true, each row is rendered with a 1px border for a card-style list. */
  itemBordered?: boolean
  /** When true, each row's label is rendered with bold weight. */
  itemLabelBold?: boolean

  /** Called with the row's value on row click (single-select mode). Omit when using per-item `onToggleChecked`. */
  onChange?: (value: string) => void
}

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",

  "& [cmdk-root]": {
    width: "100%",
  },

  "& [cmdk-label]": {
    display: "none",
  },
})

const VirtualizedListContainer = styled.div({
  width: "100%",
  "& [cmdk-item]": {
    display: "block !important",
  },
})

export const FilteredList = ({
  maxHeight,
  id,
  itemHeight,
  color,
  "data-playwright-testid": playwrightTestId,
  items,
  hideSearch,
  value = "",
  onChange = () => {},
  itemBordered = false,
  itemLabelBold = false,
}: FilteredListProps) => {
  const [filter, setFilter] = useState("")

  const maxHeightAsNumber =
    typeof maxHeight === "number" ? maxHeight : typeof maxHeight === "string" ? parseInt(maxHeight, 10) || 300 : 300

  const filteredItems = useMemo(() => {
    return items?.filter(item => item.label.toLowerCase().includes(filter.toLowerCase())) ?? []
  }, [items, filter])

  const itemSizeFn = useMemo(() => {
    if (typeof itemHeight === "function") {
      return itemHeight
    }
    const fixed = typeof itemHeight === "number" ? itemHeight : 60
    return () => fixed
  }, [itemHeight])

  const totalContentHeight = useMemo(() => {
    let total = 0
    for (let i = 0; i < filteredItems.length; i++) {
      total += itemSizeFn(i)
    }
    return total
  }, [filteredItems, itemSizeFn])

  const allItemsFit = totalContentHeight <= maxHeightAsNumber

  return (
    <Container id={id} data-playwright-testid={playwrightTestId} className="<FilteredList /> - ">
      <Stack hug vertical data-playwright-testid={playwrightTestId}>
        <Align vertical topLeft>
          {!hideSearch && (
            <>
              <InputTextSingle
                size="large"
                width="auto"
                color={color}
                value={filter}
                onChange={value => setFilter(value)}
              />

              <Spacer xsmall />
            </>
          )}
          {filteredItems?.length > 0 ? (
            <VirtualizedListContainer style={{ height: Math.min(maxHeightAsNumber, totalContentHeight) }}>
              <List<FilteredVirtualListItemProps>
                rowComponent={FilteredVirtualListItem}
                rowCount={filteredItems.length}
                rowHeight={itemSizeFn}
                rowProps={{
                  items: filteredItems,
                  selectedValue: value,
                  onChange: onChange,
                  color: color,
                  itemBordered,
                  itemLabelBold,
                }}
                style={allItemsFit ? { overflow: "hidden" } : undefined}
              />
            </VirtualizedListContainer>
          ) : (
            <Text fill={[color, 700]} small>
              Nothing found
            </Text>
          )}
        </Align>
      </Stack>
    </Container>
  )
}
