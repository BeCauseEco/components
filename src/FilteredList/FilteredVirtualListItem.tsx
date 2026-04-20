import React from "react"
import { Color, ColorWithLightness, computeColor } from "@new/Color"
import { Avatar } from "@new/Avatar/Avatar"
import { Text } from "@new/Text/Text"
import { Icon } from "@new/Icon/Icon"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    item.onToggleFavorite?.()
  }

  const handleCheckboxChange = (checked: boolean) => {
    void checked
    item.onToggleChecked?.()
  }

  return (
    <div style={style}>
      <VirtualizedItemContainer
        selected={isSelected}
        colorSelected={[data.color, 400]}
        colorBackgroundHover={[data.color, 50]}
        onClick={() => {
          if (item.onToggleChecked) {
            item.onToggleChecked()
          } else {
            data.onChange(item.value)
          }
        }}
      >
        <div className="flex items-center gap-2">
          {item.avatarSrc && <Avatar size="large" src={item.avatarSrc} title={item.label} />}

          <div className="flex flex-1 flex-col">
            <Text small fill={[data.color, 700]}>
              {item.label}
            </Text>
            {item.subtitle && (
              <Text tiny fill={[data.color, 500]} wrap>
                {item.subtitle}
              </Text>
            )}
          </div>

          {item.onToggleFavorite && (
            <Icon
              name="favorite"
              medium
              fill={item.isFavorite ? [Color.Tertiary, 500] : [data.color, 300]}
              style={item.isFavorite ? "filled" : "outlined"}
              onClick={handleFavoriteClick}
              tooltip={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            />
          )}

          {item.onToggleChecked && (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center">
              <InputCheckbox
                size="large"
                color={data.color}
                value={item.isChecked === true}
                onChange={handleCheckboxChange}
              />
            </div>
          )}
        </div>
      </VirtualizedItemContainer>
    </div>
  )
}
