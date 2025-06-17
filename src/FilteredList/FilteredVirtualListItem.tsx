import React from "react"
import { Color, ColorWithLightness, computeColor } from "@new/Color"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Avatar } from "@new/Avatar/Avatar"
import { Spacer } from "@new/Stack/Spacer"
import { Text } from "@new/Text/Text"
import styled from "@emotion/styled"
import { ListItemProps } from "@new/FilteredList/FilteredList"

type ItemData = {
  items: ListItemProps[]
  selectedValue: string
  color: Color
  onChange: (value: string) => void
}

const VirtualizedItemContainer = styled.div<{
  selected: boolean
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
}>(p => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "calc(var(--BU) * 2)",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "transparent",

  "&:hover": {
    backgroundColor: computeColor(p.colorBackgroundHover),
  },

  ...(p.selected && {
    backgroundColor: computeColor(p.colorBackgroundHover),
  }),
}))

export const FilteredVirtualListItem = ({
  index,
  style,
  data,
}: {
  index: number
  style: React.CSSProperties
  data: ItemData
}) => {
  const item = data.items[index]
  if (!item) {
    return null
  }

  const isSelected = item.value === data.selectedValue

  return (
    <div style={style}>
      <VirtualizedItemContainer
        selected={isSelected}
        colorSelected={[data.color, 400]}
        colorBackgroundHover={[data.color, 50]}
        onClick={() => data.onChange(item.value)}
      >
        <Stack horizontal hug>
          <Align horizontal left hug>
            <Avatar size="large" src={item.avatarSrc} title={item.label} />
          </Align>

          <Spacer xsmall />

          <Align horizontal left>
            <Text small fill={[data.color, 700]}>
              {item.label}
            </Text>
          </Align>
        </Stack>
      </VirtualizedItemContainer>
    </div>
  )
}
