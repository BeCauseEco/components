import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, useCallback, useEffect, useId, useMemo, useState } from "react"
import React from "react"
import { Text, TText } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { computeColor, EColor } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { EInputButtonVariant, InputButton } from "@new/InputButton/InputButton"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { EDirection } from "@new/EDirection"
import { Icon, TIcon } from "@new/Icon/Icon"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { EShadow } from "@new/EShadow"
import { InputText } from "@new/InputText/InputText"
import { LayoutCombobox } from "./internal/LayoutInputCombobox"
import { EAlignment } from "@new/EAlignment"
import { Spacer } from "@new/Spacer/Spacer"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { TPlaywright } from "@new/TPlaywright"
import { TInputComboBoxFilterOptions, TInputComboboxValue } from "./InputCombobox"
import { Virtuoso } from "react-virtuoso"
import { TVirtualizedInputComboboxItem } from "./VirtualizedInputComboboxItem"
import { Chip } from "@new/Chip/Chip"

const Container = styled.div({
  display: "flex",
})

const CommandItemStyled = styled(CommandItem)<
  Pick<TVirtualizedInputComboboxItem, "colorBackground" | "colorBackgroundHover" | "colorForeground"> & {
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

const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
})

const TextWithOverflow = styled(Text)<Pick<TVirtualizedInputCombobox, "width">>(p => ({
  minWidth: p.width === ESize.Small ? "150px" : "300px",
  overflowX: "hidden",
  overflowY: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
  display: "block",
}))

const SelectedItemsContainer = styled.div({
  display: "flex",
  gap: "3px",
})

type TVirtualizedInputCombobox = TPlaywright & {
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

  /**
   * When InputCombobox.multiple is set to true; "value" parameter is of type boolean[].
   *
   * Otherwise the type is of string */
  id?: string
  onChange: (selectedIds: string[]) => void

  children: ReactElement<TVirtualizedInputComboboxItem> | ReactElement<TVirtualizedInputComboboxItem>[]
}

const LIST_HEIGHT = 360
const LIST_WIDTH = 260

export const VirtualizedInputCombobox = forwardRef<HTMLDivElement, PropsWithChildren<TVirtualizedInputCombobox>>(
  (props, ref) => {
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
    } = props

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    const [filteredItemIds, setFilteredItemIds] = useState<string[]>([])
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

    const [height, setHeight] = useState(1)

    const key = useId()

    const items: { [id: string]: TVirtualizedInputComboboxItem } = useMemo(() => {
      const a: { [id: string]: TVirtualizedInputComboboxItem } = {}

      React.Children.forEach(children, child => {
        if (React.isValidElement(child)) {
          a[child.props.id] = child.props as TVirtualizedInputComboboxItem
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
      if (multiple) {
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
          <SelectedItemsContainer>
            {visibleItems.map((item, index) => (
              <Chip
                colorBackground={[EColor.Black, 100]}
                key={index}
                children={
                  <KeyValuePair direction={EDirection.Horizontal} spacing={ESize.Xsmall}>
                    <Text size={ESize.Small} color={[EColor.Black, 700]} alignment={EAlignment.Start}>
                      {item}
                    </Text>
                    <Icon
                      name="close"
                      point
                      size={ESize.Small}
                      color={[EColor.Black, 700]}
                      onClick={(event: Event) => handleRemoveItem(event, item)}
                    />
                  </KeyValuePair>
                }
              />
            ))}
            {remainingCount > 0 && (
              <Chip
                key={remainingCount}
                colorBackground={[EColor.Black, 100]}
                children={
                  <Text size={ESize.Small} color={[EColor.Black, 700]} alignment={EAlignment.Start}>
                    +{remainingCount}
                  </Text>
                }
              />
            )}
          </SelectedItemsContainer>
        )
      }
      return Object.values(items).findLast(item => (item.value as string) === value)?.label || textNoSelection
    }

    const handleRemoveItem = (event: Event, label: string) => {
      event.preventDefault()
      const item = Object.values(items).findLast(item => item.label.toLowerCase() === label.toLowerCase())

      onChange([item?.id as string])
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

        const itemsFiltered = Object.values(items).filter(item =>
          item.label.toLowerCase().includes(value.toLowerCase()),
        )

        setFilteredItemIds(itemsFiltered.map(item => item.id))
      },
      [items],
    )

    const filterWithDebounce = useMemo(() => debounce(filterResults, 300), [filterResults])

    const filteredItems = useMemo(() => {
      const filteredItemIdsSet = new Set(filteredItemIds)

      return Object.entries(items)
        .filter(([id]) => filteredItemIdsSet.has(id))
        .map(([, value]) => value)
    }, [filteredItemIds, items])

    return (
      <Container ref={ref} id={id} data-playwright-testid={playwrightTestId}>
        <Popover
          open={open}
          onOpenChange={setOpen}
          alignment={EAlignment.Start}
          trigger={
            <KeyValuePair direction={EDirection.Vertical} spacing={ESize.Xsmall}>
              {label && <Label htmlFor={key}>{label}</Label>}

              <InputButton
                size={ESize.Medium}
                variant={EInputButtonVariant.Outlined}
                color={colorButtonBackground}
                colorBackgroundHover={[colorButtonBackground, 50]}
                outlineColor={[colorButtonBackground, 100]}
              >
                <KeyValuePair direction={EDirection.Horizontal} spacing={ESize.Large}>
                  <>
                    {icon && (
                      <>
                        {icon} <Spacer size={ESize.Xsmall} />
                      </>
                    )}

                    <TextWithOverflow
                      color={[colorButtonForeground, 1000]}
                      size={ESize.Xsmall}
                      alignment={EAlignment.Start}
                      width={width}
                    >
                      {generateCurrentValueLabel(multiple)}
                    </TextWithOverflow>
                  </>

                  <Icon
                    name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                    size={ESize.Medium}
                    color={[colorButtonForeground, 1000]}
                  />
                </KeyValuePair>
              </InputButton>
            </KeyValuePair>
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
                filteredItems.length > 9 && (
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
                <Command loop shouldFilter={false}>
                  {filterOptions && (
                    <CommandEmptyStyled>
                      <Text color={[colorPopOverForeground, 700]} size={ESize.Xsmall}>
                        {filterOptions.textFilterNoResults}
                      </Text>
                    </CommandEmptyStyled>
                  )}

                  <CommandGroup>
                    <Virtuoso
                      style={{
                        height: `${height}px`,
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
                          ) : (
                            <Text size={ESize.Xsmall} color={[item.colorForeground, 700]} wrap>
                              {item.label}
                            </Text>
                          )}
                        </CommandItemStyled>
                      )}
                    />
                  </CommandGroup>
                </Command>
              }
            />
          }
        />
      </Container>
    )
  },
)

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}
