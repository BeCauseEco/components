import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandItem, CommandList } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { TInputComboboxItem } from "./InputComboboxItem"
import React from "react"
import { Text, TText } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { computeColor, EColor } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { EInputButtonVariant, InputButton } from "@new/InputButton/InputButton"
import { Icon, TIcon } from "@new/Icon/Icon"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { EShadow } from "@new/EShadow"
import { InputText } from "@new/InputText/InputText"
import { LayoutCombobox } from "./internal/LayoutInputCombobox"
import { EAlignment } from "@new/EAlignment"
import { Spacer } from "@new/Spacer/Spacer"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { TPlaywright } from "@new/TPlaywright"
import { Chip } from "@new/Chip/Chip"
import { Virtuoso } from "react-virtuoso"

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
  maxWidth: p.width === ESize.Small ? "150px" : "300px",
  overflowX: "hidden",
  overflowY: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
  display: "block",
}))

const InputButtonCollapse = styled(InputButton)({
  height: 0,
  paddingTop: 0,
})

export type TInputComboBoxFilterOptions = {
  textFilterNoResults: string
  textFilterPlaceholder: string
}

export type TInputComboboxValue = string | boolean[]

type TInputCombobox = TPlaywright & {
  colorButtonBackground: EColor
  colorButtonForeground: EColor
  colorPopOverBackground: EColor
  colorPopOverForeground: EColor
  textNoSelection: string
  width: ESize.Small | ESize.Medium

  /** Enables filtering, if supplied. */
  filterOptions?: TInputComboBoxFilterOptions

  label?: ReactElement<TText>
  icon?: ReactElement<TIcon>
  value: TInputComboboxValue

  /**
   * Enables multiple selection.
   *
   * When InputCombobox.multiple is set to true both InputCombobox.value and parameter: "value" of the onChange function types are of boolean[]
   *
   * Otherwise both types are of string. */
  multiple?: boolean

  id?: string

  onChange: (selectedIds: string[]) => void

  children: ReactElement<TInputComboboxItem> | ReactElement<TInputComboboxItem>[]

  /**
   * Enables the virtuoso list for the combobox. Only use this if you have a large number of items.
   */
  enableVirtuoso?: boolean
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
    value,
    multiple = false,
    id,
    onChange,
    children,
    playwrightTestId,
    enableVirtuoso,
  } = props

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const [height, setHeight] = useState(1)

  const [filteredItemIds, setFilteredItemIds] = useState<string[]>([])
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

  const items: { [id: string]: TInputComboboxItem } = useMemo(() => {
    const a: { [id: string]: TInputComboboxItem } = {}

    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        a[child.props.id] = child.props as TInputComboboxItem
      }
    })

    return a
  }, [React.Children.count(children)])

  useEffect(() => {
    const newItems = Object.values(items).map(item => item.id)
    const newItemsSet = new Set(newItems)
    setFilteredItemIds(newItems)
    setSelectedItemIds(prev => prev.filter(prevId => newItemsSet.has(prevId)))
  }, [items])

  const generateCurrentValueLabel = (multiple: boolean) => {
    if (!multiple) {
      return (
        <TextWithOverflow
          color={[colorButtonForeground, 700]}
          size={ESize.Xsmall}
          alignment={EAlignment.Start}
          width={width}
        >
          {Object.values(items).findLast(item => (item.value as string) === value)?.label || textNoSelection}
        </TextWithOverflow>
      )
    }

    const selectedItemsIdsSet = new Set(selectedItemIds)
    const selectedItems = Object.entries(items)
      .filter(([id]) => selectedItemsIdsSet.has(id))
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
              <TextWithOverflow color={[colorButtonForeground, 700]} size={ESize.Xsmall} width={width}>
                {item}
              </TextWithOverflow>

              <Spacer size={ESize.Tiny} />

              <InputButtonCollapse
                size={ESize.Small}
                variant={EInputButtonVariant.Transparent}
                color={colorButtonBackground}
                omitPadding
              >
                <Icon
                  name="close"
                  size={ESize.Medium}
                  color={[colorButtonBackground, 700]}
                  onClick={(event: Event) => handleRemoveItem(event, item)}
                />
              </InputButtonCollapse>
            </Chip>

            <Spacer size={ESize.Tiny} />
          </>
        ))}

        {remainingCount > 0 && (
          <Chip key={remainingCount} colorBackground={[colorButtonBackground, 100]}>
            <Text size={ESize.Xsmall} color={[EColor.Black, 700]}>
              +{remainingCount}
            </Text>
          </Chip>
        )}
      </>
    )
  }

  const filteredItems = useMemo(() => {
    const filteredItemIdsSet = new Set(filteredItemIds)

    return Object.entries(items)
      .filter(([id]) => filteredItemIdsSet.has(id))
      .map(([, value]) => value)
  }, [filteredItemIds, items])

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
        itemContent={(index, item) => (
          <CommandItemStyled
            key={index}
            multiple={multiple}
            value={item.label}
            onSelect={value => (multiple ? () => {} : onSelectSingle(value))}
            selected={value == item.value}
            colorBackground={item.colorBackground}
            colorBackgroundHover={item.colorBackgroundHover}
            colorForeground={item.colorForeground}
            data-playwright-testid={item.playwrightTestId}
          >
            {multiple ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.icon}
                <Spacer size={ESize.Xsmall} />

                <InputCheckbox
                  value={selectedItemIds.includes(item.id)}
                  onChange={value => onSelectMultiple(item.id, value)}
                  colorBackground={item.colorBackground}
                  colorForeground={item.colorForeground}
                  label={
                    <Text size={ESize.Xsmall} color={[item.colorBackground, 700]} wrap>
                      {item.label}
                    </Text>
                  }
                />
              </div>
            ) : (
              <Text size={ESize.Xsmall} color={[item.colorForeground, 700]} wrap>
                {item.label}
              </Text>
            )}
          </CommandItemStyled>
        )}
      />
    )
  } else {
    commandListItems = (
      <>
        {filteredItems.map((item, index) => (
          <CommandItemStyled
            multiple={multiple}
            key={index}
            value={item.label}
            onSelect={value => (multiple ? () => {} : onSelectSingle(value))}
            selected={value === item.value}
            colorBackground={item.colorBackground}
            colorBackgroundHover={item.colorBackgroundHover}
            colorForeground={item.colorForeground}
            data-playwright-testid={item.playwrightTestId}
          >
            {multiple ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.icon}

                <Spacer size={ESize.Xsmall} />

                <InputCheckbox
                  value={selectedItemIds.includes(item.id)}
                  onChange={value => onSelectMultiple(item.id, value)}
                  colorBackground={item.colorBackground}
                  colorForeground={item.colorForeground}
                  label={
                    <Text size={ESize.Xsmall} color={[item.colorBackground, 700]}>
                      {item.label}
                    </Text>
                  }
                />
              </div>
            ) : (
              <Text size={ESize.Xsmall} color={[item.colorForeground, 700]}>
                {item.label}
              </Text>
            )}
          </CommandItemStyled>
        ))}
      </>
    )
  }

  const handleRemoveItem = (event: Event, label: string) => {
    event.preventDefault()

    const item = Object.values(items).findLast(item => item.label.toLowerCase() === label.toLowerCase())
    if (!item) {
      return
    }

    setSelectedItemIds(prev => {
      const updatedItems = prev.filter(id => id !== item.id)
      onChange(updatedItems)
      return updatedItems
    })
  }

  const onSelectSingle = (value: string) => {
    setOpen(false)

    const item = Object.values(items).findLast(item => item.label.toLowerCase() === value.toLowerCase())

    onChange([item?.id as string])
  }

  const onSelectMultiple = (selectedItemId: string, value: boolean) => {
    setSelectedItemIds(prev => {
      const selectedItemsIds = value ? [...prev, selectedItemId] : prev.filter(item => item !== selectedItemId)
      onChange(selectedItemsIds)

      return selectedItemsIds
    })
  }

  const filterResults = useCallback(
    (value: string) => {
      if (value === "") {
        setFilteredItemIds(Object.values(items).map(item => item.id))
        return
      }

      const itemsFiltered = Object.values(items).filter(item => item.label.toLowerCase().includes(value.toLowerCase()))

      setFilteredItemIds(itemsFiltered.map(item => item.id))
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
          <InputButton size={ESize.Medium} variant={EInputButtonVariant.Outlined} color={colorButtonBackground}>
            {label && (
              <>
                {label}

                <Spacer size={ESize.Xsmall} />
              </>
            )}

            {icon && (
              <>
                {icon} <Spacer size={ESize.Small} />
              </>
            )}

            {generateCurrentValueLabel(multiple)}

            <Spacer size={ESize.Xsmall} />

            <Icon
              name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              size={ESize.Medium}
              color={[colorButtonForeground, 700]}
            />
          </InputButton>
        }
        background={
          <BackgroundCard
            colorBackground={[colorPopOverBackground, 700]}
            shadow={EShadow.Medium}
            borderRadius={ESize.Tiny}
          />
        }
        layout={
          <LayoutCombobox
            contentTop={
              filterOptions &&
              Object.keys(items).length > 9 && (
                <>
                  <InputText
                    width={ESize.Full}
                    color={colorButtonBackground}
                    value={search}
                    onChange={value => {
                      setSearch(value)
                      filterWithDebounce(value)
                    }}
                    placeholder={filterOptions.textFilterPlaceholder}
                  />

                  <Spacer size={ESize.Xsmall} />
                </>
              )
            }
            contentBottom={
              <Command loop>
                {filterOptions && (
                  <CommandEmptyStyled>
                    <Text color={[colorPopOverForeground, 700]} size={ESize.Xsmall}>
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
