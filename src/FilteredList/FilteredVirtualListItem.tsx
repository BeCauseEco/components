import React from "react"
import { Color, ColorWithLightness, computeColor } from "@new/Color"
import { Avatar } from "@new/Avatar/Avatar"
import { Text } from "@new/Text/Text"
import { Icon } from "@new/Icon/Icon"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import styled from "@emotion/styled"
import { ListItemProps } from "@new/FilteredList/FilteredList"

export type FilteredVirtualListItemProps = {
  items: ListItemProps[]
  selectedValue: string
  color: Color
  onChange: (value: string) => void
  itemBordered: boolean
  itemLabelBold: boolean
}

const VirtualizedItemContainer = styled.div<{
  selected: boolean
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
  bordered: boolean
  colorBorder: ColorWithLightness
}>(p => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "calc(var(--BU) * 2)",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "transparent",

  ...(p.bordered && {
    border: `1px solid ${computeColor(p.colorBorder)}`,
  }),

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
  items,
  selectedValue,
  color,
  onChange,
  itemBordered,
  itemLabelBold,
}: {
  index: number
  style: React.CSSProperties
} & FilteredVirtualListItemProps) => {
  const item = items[index]
  if (!item) {
    return null
  }

  const isSelected = item.value === selectedValue

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    item.onToggleFavorite?.()
  }

  return (
    <div style={style}>
      <VirtualizedItemContainer
        selected={isSelected}
        colorSelected={[color, 400]}
        colorBackgroundHover={[color, 50]}
        bordered={itemBordered}
        colorBorder={[color, 100]}
        onClick={() => {
          if (item.onToggleChecked) {
            item.onToggleChecked()
          } else {
            onChange(item.value)
          }
        }}
      >
        <div className="flex items-center gap-4">
          {item.avatarSrc && <Avatar size="large" src={item.avatarSrc} title={item.label} />}

          <div className="flex flex-1 flex-col">
            <Text small fill={[color, 700]}>
              {itemLabelBold ? <b>{item.label}</b> : item.label}
            </Text>
            {item.subtitle && (
              <Text tiny fill={[color, 500]} wrap>
                {item.subtitle}
              </Text>
            )}
          </div>

          {item.onToggleFavorite && (
            <Icon
              name="favorite"
              medium
              fill={item.isFavorite ? [Color.Tertiary, 500] : [color, 300]}
              style={item.isFavorite ? "filled" : "outlined"}
              onClick={handleFavoriteClick}
              tooltip={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            />
          )}

          {item.onToggleChecked && (
            <div onClick={e => e.stopPropagation()} className="flex items-center">
              <InputCheckbox
                size="large"
                color={color}
                value={item.isChecked === true}
                onChange={() => item.onToggleChecked?.()}
              />
            </div>
          )}
        </div>
      </VirtualizedItemContainer>
    </div>
  )
}
