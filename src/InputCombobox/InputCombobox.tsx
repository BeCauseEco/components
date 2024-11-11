import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandItem, CommandList } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { TInputComboboxItem } from "@new/InputCombobox/InputComboboxItem"
import React from "react"
import { Text, TextProps } from "@new/Text/Text"
import { computeColor, Color } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { Icon, IconProps } from "@new/Icon/Icon"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { EShadow } from "@new/EShadow"
import { LayoutCombobox } from "./internal/LayoutInputCombobox"
import { EAlignment } from "@new/EAlignment"
import { Spacer } from "@new/Spacer/Spacer"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { Playwright } from "@new/Playwright"
import { Chip } from "@new/Chip/Chip"
import { Virtuoso } from "react-virtuoso"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { Size } from "@new/Size"
import { InputTextSingle } from "@new/InputText/InputTextSingle"

const Container = styled.div({
  display: "flex",
})

const CommandItemStyled = styled(CommandItem)<
  Pick<TInputComboboxItem, "colorBackground" | "colorBackgroundHover" | "colorForeground"> & {
    multiple: boolean
    selected: boolean
  }
>(p => ({
  position: "relative",
  padding: p.multiple ? "calc(var(--BU) * 1.5) 0" : "calc(var(--BU) * 1.5) calc(var(--BU) * 3)",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: p.multiple ? "transparent" : computeColor([p.colorBackground, 700]),

  "&[data-selected='true']": {
    backgroundColor: computeColor([p.colorBackgroundHover, 100]),
  },

  ...(p.selected && {
    ":after": {
      content: `""`,
      display: "flex",
      position: "absolute",
      width: "calc(var(--BU) * 1.5)",
      height: "calc(var(--BU) * 1.5)",
      top: "calc(50% - calc(var(--BU) / 1.5))",
      left: "0",
      borderRadius: "var(--BU)",
      backgroundColor: computeColor([p.colorBackgroundHover, 200]),
    },
  }),
}))

const CommandEmptyStyled = styled(CommandEmpty)({
  padding: "calc(var(--BU) * 1.5) 0",
  userSelect: "none",
})

const TextWithOverflow = styled(Text)<Pick<TInputCombobox, "width">>(p => ({
  maxWidth: p.width === "small" ? "150px" : "300px",
  overflowX: "hidden",
  overflowY: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
  display: "block",
}))

export type TInputComboBoxFilterOptions = {
  textFilterNoResults: string
  textFilterPlaceholder: string
}

type TInputCombobox = Playwright & {
  colorButtonBackground: Color
  colorButtonForeground: Color
  colorPopOverBackground: Color
  colorPopOverForeground: Color
  textNoSelection: string
  width: "small" | "large"

  /** Enables filtering, if supplied. */
  filterOptions?: TInputComboBoxFilterOptions

  label?: ReactElement<TextProps>
  icon?: ReactElement<IconProps>

  multiple?: boolean

  id?: string

  /**
   * When InputCombobox.multiple is set to true; "value" parameter is of type string[].
   *
   * Otherwise the type is of string */
  value: string | string[]

  onChange: (value: string | string[]) => void

  children: ReactElement<TInputComboboxItem> | ReactElement<TInputComboboxItem>[]

  /**
   * Enables the virtuoso list for the combobox. Only use this if you have a large number of items.
   */
  enableVirtuoso?: boolean
  isClearable?: boolean
}

const LIST_HEIGHT = 360
const LIST_WIDTH = 260

export const InputCombobox = forwardRef<HTMLDivElement, PropsWithChildren<TInputCombobox>>((props, ref) => {
  const {
    colorButtonBackground,
    colorButtonForeground,
    colorPopOverBackground,
    colorPopOverForeground,
    textNoSelection,
    width,
    filterOptions,
    label,
    icon,
    multiple = false,
    id,
    value,
    onChange,
    children,
    playwrightTestId,
    enableVirtuoso,
    isClearable = false,
  } = props

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const [height, setHeight] = useState(1)

  const [filteredValues, setFilteredValues] = useState<string[]>([])

  const items: { [value: string]: TInputComboboxItem } = useMemo(() => {
    const a: { [value: string]: TInputComboboxItem } = {}

    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        a[child.props.value] = child.props as TInputComboboxItem
      }
    })

    return a
  }, [React.Children.count(children)])

  useEffect(() => {
    const newItems = Object.values(items).map(item => item.value)
    setFilteredValues(newItems)
  }, [items])

  const generateCurrentValueLabel = (multiple: boolean) => {
    if (!multiple) {
      const selectedItem = Object.values(items).findLast(item => value === item.value)
      if (isClearable && selectedItem) {
        return (
          <Chip colorBackground={[colorButtonBackground, 100]}>
            <TextWithOverflow fill={[colorButtonForeground, 700]} xsmall width={width}>
              {selectedItem.label}
            </TextWithOverflow>

            <Spacer tiny />

            <InputButtonIconTertiary size="small" iconName="close" hug />
          </Chip>
        )
      }

      return (
        <TextWithOverflow fill={[colorButtonForeground, 700]} width={width} xsmall>
          {selectedItem?.label || textNoSelection}
        </TextWithOverflow>
      )
    }

    const selectedValuesSet = new Set(value)
    const selectedItems = Object.entries(items)
      .filter(([id]) => selectedValuesSet.has(id))
      .flatMap(([, value]) => value.label)

    if (selectedItems.length === 0) {
      return textNoSelection
    }

    const visibleItems = selectedItems.slice(0, 2)
    const remainingCount = selectedItems.length - 2

    return (
      <>
        {visibleItems?.map((item, index) => (
          <>
            <Chip colorBackground={[colorButtonBackground, 100]} key={index}>
              <TextWithOverflow fill={[colorButtonForeground, 700]} width={width} xsmall>
                {item}
              </TextWithOverflow>

              <Spacer tiny />

              <InputButtonIconTertiary size="small" iconName="close" onClick={() => handleRemoveItem(item)} hug />
            </Chip>

            <Spacer tiny />
          </>
        ))}

        {remainingCount > 0 && (
          <Chip key={remainingCount} colorBackground={[colorButtonBackground, 100]}>
            <Text xsmall fill={[Color.Black, 700]}>
              +{remainingCount}
            </Text>
          </Chip>
        )}
      </>
    )
  }

  const getCommandItem = (index: number, item: TInputComboboxItem): React.ReactNode => {
    const onSelectSingle = (value: string) => {
      setOpen(false)

      const item = Object.values(items).findLast(item => item.label.toLowerCase() === value.trim().toLowerCase())

      if (item) {
        onChange(item.value)
      }
    }

    const onSelectMultiple = (selectedItemId: string, newValue: boolean) => {
      const currentValue = value as string[]
      const selectedItemsIds = newValue
        ? [...currentValue, selectedItemId]
        : currentValue.filter(item => item !== selectedItemId)
      onChange(selectedItemsIds)
    }

    return (
      <CommandItemStyled
        key={index}
        multiple={multiple}
        value={item.label}
        onSelect={value => (multiple ? () => {} : onSelectSingle(value))}
        selected={multiple ? (value as string[]).includes(item.value) : value === item.value}
        colorBackground={item.colorBackground}
        colorBackgroundHover={item.colorBackgroundHover}
        colorForeground={item.colorForeground}
        data-playwright-testid={item.playwrightTestId}
      >
        {multiple ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {item.icon}

            <Spacer xsmall />

            <InputCheckbox
              size={"small"}
              color={item.colorBackground}
              value={multiple ? (value as string[]).includes(item.value) : value === item.value}
              onChange={value => onSelectMultiple(item.value, value)}
              label={item.label}
            />
          </div>
        ) : (
          <Text xsmall fill={[item.colorForeground, 700]} wrap>
            {item.label}
          </Text>
        )}
      </CommandItemStyled>
    )
  }

  const filteredItems = useMemo(() => {
    const filteredItemIdsSet = new Set(filteredValues)

    return Object.entries(items)
      .filter(([id]) => filteredItemIdsSet.has(id))
      .map(([, value]) => value)
  }, [filteredValues, items])

  let commandListItems: ReactElement | null = null
  if (enableVirtuoso) {
    commandListItems = (
      <Virtuoso
        style={{
          height: `${height}px`,
          maxHeight: "calc(var(--radix-popover-content-available-height) - calc(var(--BU) * 20))",
          minWidth: `${LIST_WIDTH}px`,
          overflowX: "hidden",
        }}
        increaseViewportBy={100}
        totalListHeightChanged={h => setHeight(h > LIST_HEIGHT ? LIST_HEIGHT : h)}
        data={filteredItems}
        itemContent={(index, item) => getCommandItem(index, item)}
      />
    )
  } else {
    commandListItems = <>{filteredItems.map((item, index) => getCommandItem(index, item))}</>
  }

  const handleRemoveItem = (label: string) => {
    // event.preventDefault()

    const item = Object.values(items).findLast(item => item.label.toLowerCase() === label.toLowerCase())
    if (!item) {
      return
    }

    const updatedItems = (value as string[]).filter(id => id !== item.value)
    onChange(updatedItems)
  }

  const filterResults = useCallback(
    (value: string) => {
      if (value === "") {
        setFilteredValues(Object.values(items).map(item => item.value))
        return
      }

      const itemsFiltered = Object.values(items).filter(item => item.label.toLowerCase().includes(value.toLowerCase()))

      setFilteredValues(itemsFiltered.map(item => item.value))
    },
    [items],
  )

  const filterWithDebounce = useMemo(() => debounce(filterResults, 300), [filterResults])

  return (
    <Container ref={ref} id={id} data-playwright-testid={playwrightTestId}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        alignment={EAlignment.Start}
        trigger={
          // <InputButton size={ESize.Medium} variant={EInputButtonVariant.Outlined} color={colorButtonBackground}>
          <button>
            {label && (
              <>
                {label}

                <Spacer xsmall />
              </>
            )}

            {icon && (
              <>
                {icon} <Spacer small />
              </>
            )}

            {generateCurrentValueLabel(multiple)}

            <Spacer xsmall />

            <Icon
              name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              medium
              fill={[colorButtonForeground, 700]}
            />
          </button>
        }
        background={
          <BackgroundCard
            colorBackground={[colorPopOverBackground, 700]}
            shadow={EShadow.Medium}
            borderRadius={Size.Tiny}
          />
        }
        layout={
          <LayoutCombobox
            contentTop={
              filterOptions &&
              Object.keys(items).length > 9 && (
                <>
                  <InputTextSingle
                    color={colorButtonBackground}
                    value={search}
                    onChange={value => {
                      setSearch(value)
                      filterWithDebounce(value)
                    }}
                    placeholder={filterOptions.textFilterPlaceholder}
                    size={"small"}
                  />

                  <Spacer xsmall />
                </>
              )
            }
            contentBottom={
              <Command loop>
                {filterOptions && (
                  <CommandEmptyStyled>
                    <Text fill={[colorPopOverForeground, 700]} xsmall>
                      {filterOptions.textFilterNoResults}
                    </Text>
                  </CommandEmptyStyled>
                )}

                <CommandList>{commandListItems}</CommandList>
              </Command>
            }
          />
        }
      />
    </Container>
  )
})

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}
