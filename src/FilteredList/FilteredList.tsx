import styled from "@emotion/styled"
import { useState, useMemo } from "react"
import React from "react"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Spacer } from "@new/Stack/Spacer"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { OverflowContainerProps } from "@new/OverflowContainer/OverflowContainer"
import { FixedSizeList } from "react-window"
import { FilteredVirtualListItem } from "@new/FilteredList/FilteredVirtualListItem"
import { PlaywrightProps } from "@new/Playwright"

export type ListItemProps = PlaywrightProps & { value: string; label: string; labelFilter?: string; avatarSrc: string }

export type FilteredListProps = ComponentBaseProps & {
  color: Color
  maxHeight: OverflowContainerProps["maxHeight"]
  value: string
  disabled?: boolean
  loading?: boolean
  itemHeight?: number
  items: ListItemProps[]

  onChange: (value: string) => void
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
  value,
  onChange,
}: FilteredListProps) => {
  const [filter, setFilter] = useState("")

  const maxHeightAsNumber = typeof maxHeight === "number" ? maxHeight : 300
  const itemHeightAsNumber = itemHeight || 60

  const filteredItems = useMemo(() => {
    return items?.filter(item => item.label.toLowerCase().includes(filter.toLowerCase())) ?? []
  }, [items, filter])

  return (
    <Container id={id} data-playwright-testid={playwrightTestId} className="<FilteredList /> - ">
      <Stack vertical data-playwright-testid={playwrightTestId}>
        <Align vertical topLeft>
          <InputTextSingle
            size="large"
            width="auto"
            color={color}
            value={filter}
            onChange={value => setFilter(value)}
          />

          <Spacer xsmall />
          {filteredItems?.length > 0 ? (
            <VirtualizedListContainer>
              <FixedSizeList
                height={Math.min(maxHeightAsNumber, filteredItems.length * itemHeightAsNumber)}
                itemCount={filteredItems.length}
                itemSize={itemHeightAsNumber}
                itemData={{
                  items: filteredItems,
                  selectedValue: value,
                  onChange: onChange,
                  color: color,
                }}
                width="100%"
              >
                {FilteredVirtualListItem}
              </FixedSizeList>
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
