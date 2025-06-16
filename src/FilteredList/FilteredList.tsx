import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandList } from "cmdk"
import { useState, useMemo } from "react"
import { FilteredListItem } from "./FilteredListItem"
import React from "react"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Spacer } from "@new/Stack/Spacer"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { OverflowContainer, OverflowContainerProps } from "@new/OverflowContainer/OverflowContainer"
import { FixedSizeList } from "react-window"
import { FilteredVirtualListItem } from "@new/FilteredList/FilteredVirtualListItem"
import { PlaywrightProps } from "@new/Playwright"

export type ListItemProps = PlaywrightProps & { value: string; label: string; labelFilter?: string; avatarSrc: string }

export type FilteredListProps = ComponentBaseProps & {
  color: Color
  maxHeight?: OverflowContainerProps["maxHeight"]
  value: string
  disabled?: boolean
  loading?: boolean
  virtualized?: boolean
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

const CommandEmptyStyled = styled(CommandEmpty)({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 2) 0",
  width: "100%",
  userSelect: "none",
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
  virtualized,
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

  if (virtualized) {
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

  return (
    <Container id={id} data-playwright-testid={playwrightTestId} className="<FilteredList /> - ">
      <Stack vertical data-playwright-testid={playwrightTestId}>
        <Align vertical topLeft>
          <Command loop>
            <InputTextSingle
              size="large"
              width="auto"
              value={filter}
              color={color}
              onChange={value => setFilter(value)}
            />

            <Spacer xsmall />

            <CommandList>
              <CommandEmptyStyled>
                <Text fill={[color, 700]} small>
                  Nothing found
                </Text>
              </CommandEmptyStyled>

              <Stack vertical hug>
                <Align vertical topLeft>
                  <OverflowContainer
                    axes="vertical"
                    colorBackground={[Color.White]}
                    colorForeground={Color.Neutral}
                    maxHeight={maxHeight}
                    hug
                  >
                    {filteredItems?.map((item, i) => (
                      <FilteredListItem
                        key={`filtered-list-item-${i}`}
                        value={item.value}
                        label={item.label}
                        onChange={onChange}
                        color={color}
                        src={item.avatarSrc}
                        title={item.label}
                        data-playwright-testid={item["data-playwright-testid"]}
                        size={"large"}
                      />
                    ))}
                  </OverflowContainer>
                </Align>
              </Stack>
            </CommandList>
          </Command>
        </Align>
      </Stack>
    </Container>
  )
}
